#!/usr/bin/env -S deno run
import { Fn_Select } from '../src/Fn_Select.ts';
import { Ref } from '../src/Ref.ts';
import { Stack } from '../src/Stack.ts';

const Constant = {
  // Note: Please replace the value of VpcId property with the VPC id of your default VPC
  defaultVpcId: 'vpc-0f68633eddd78fd56',

  // Parameters
  SecurityGroupPorts: 'SecurityGroupPorts',

  // Resources
  WebServerSecurityGroup: 'WebServerSecurityGroup',
  DbSecurityGroup: 'DbSecurityGroup',
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

// ========================================================
// Resources
// ========================================================
stack.addResource(Constant.WebServerSecurityGroup, {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    VpcId: Constant.defaultVpcId,
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
    VpcId: Constant.defaultVpcId,
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

console.log(stack.json());
