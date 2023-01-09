#!/usr/bin/env -S deno run
import { Fn_Select } from '../src/Fn_Select.ts';
import { Ref } from '../src/Ref.ts';
import { Stack } from '../src/Stack.ts';

const Constant = {
  // Parameters
  SecurityGroupPorts: 'SecurityGroupPorts',
  DbSubnets: 'DbSubnets',
  VpcId: 'VpcId',

  // Resources
  WebServerSecurityGroup: 'WebServerSecurityGroup',
  DbSecurityGroup: 'DbSecurityGroup',
  DbSubnetGroup: 'DbSubnetGroup',
};

const stack = Stack();
stack.setDescription('security groups');

// ========================================================
// Parameters
// ========================================================
stack.addParameter(Constant.SecurityGroupPorts, {
  Type: 'List<Number>',
  Description: 'Port numbers as a list: <web-server-port>,<database-port>',
  Default: '80, 3306',
});

stack.addParameter(Constant.DbSubnets, {
  Type: 'List<AWS::EC2::Subnet::Id>',
  Description: 'DB subnet ids as a list: <subnet1>,<subnet2>,...',
});

stack.addParameter(Constant.VpcId, {
  Type: 'AWS::EC2::VPC::Id',
  Description: 'A valid VPC id in your AWS account',
});

// ========================================================
// Resources
// ========================================================
stack.addResource(Constant.WebServerSecurityGroup, {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    VpcId: Ref(Constant.VpcId),
    GroupDescription: 'Web server instances security group',
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0',
        FromPort: Fn_Select(0, Ref(Constant.SecurityGroupPorts)),
        ToPort: Fn_Select(0, Ref(Constant.SecurityGroupPorts)),
        IpProtocol: 'tcp',
      },
    ],
  },
});

stack.addResource(Constant.DbSecurityGroup, {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    VpcId: Ref(Constant.VpcId),
    GroupDescription: 'Database instances security group',
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0',
        FromPort: Fn_Select(1, Ref(Constant.SecurityGroupPorts)),
        ToPort: Fn_Select(1, Ref(Constant.SecurityGroupPorts)),
        IpProtocol: 'tcp',
      },
    ],
  },
});

stack.addResource(Constant.DbSubnetGroup, {
  Type: 'AWS::RDS::DBSubnetGroup',
  Properties: {
    DBSubnetGroupDescription: 'Subnets to launch db instances into',
    SubnetIds: Ref(Constant.DbSubnets),
  },
});

console.log(stack.json());
