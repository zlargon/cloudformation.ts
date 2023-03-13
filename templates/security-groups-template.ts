#!/usr/bin/env -S deno run
import { Fn_Select } from '../src/Fn_Select.ts';
import { createStack } from '../src/Stack.ts';

const stack = createStack({
  Description: 'security groups',
});

// ========================================================
// Parameters
// ========================================================
const SecurityGroupPorts = stack.addParameter('SecurityGroupPorts', {
  Type: 'List<Number>',
  Description: 'Port numbers as a list: <web-server-port>,<database-port>',
  Default: '80, 3306',
});

const DbSubnets = stack.addParameter('DbSubnets', {
  Type: 'List<AWS::EC2::Subnet::Id>',
  Description: 'DB subnet ids as a list: <subnet1>,<subnet2>,...',
});

const VpcId = stack.addParameter('VpcId', {
  Type: 'AWS::EC2::VPC::Id',
  Description: 'A valid VPC id in your AWS account',
});

// ========================================================
// Resources
// ========================================================
stack.addResource('WebServerSecurityGroup', {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    VpcId: VpcId.Ref(),
    GroupDescription: 'Web server instances security group',
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0',
        FromPort: Fn_Select({
          Options: SecurityGroupPorts.Ref(),
          Index: 0,
        }),
        ToPort: Fn_Select({
          Options: SecurityGroupPorts.Ref(),
          Index: 0,
        }),
        IpProtocol: 'tcp',
      },
    ],
  },
});

stack.addResource('DbSecurityGroup', {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    VpcId: VpcId.Ref(),
    GroupDescription: 'Database instances security group',
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0',
        FromPort: Fn_Select({
          Options: SecurityGroupPorts.Ref(),
          Index: 1,
        }),
        ToPort: Fn_Select({
          Options: SecurityGroupPorts.Ref(),
          Index: 1,
        }),
        IpProtocol: 'tcp',
      },
    ],
  },
});

stack.addResource('DbSubnetGroup', {
  Type: 'AWS::RDS::DBSubnetGroup',
  Properties: {
    DBSubnetGroupDescription: 'Subnets to launch db instances into',
    SubnetIds: DbSubnets.Ref(),
  },
});

console.log(stack.json());
