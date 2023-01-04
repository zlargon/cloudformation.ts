#!/usr/bin/env -S deno run
import { Stack } from '../src/Stack.ts';
import { Tag } from '../src/Tag.ts';

const stack = Stack();
stack.setDescription('Our first template in CloudFormation course.');

// EC2 Instance
stack.addResource('WebServerInstance', {
  Type: 'AWS::EC2::Instance',
  Properties: {
    ImageId: 'ami-0b5eea76982371e91',
    InstanceType: 't2.micro',
    Tags: [
      Tag('Name', 'Web server'), //
      Tag('Project', 'CloudFormation Step By Step'),
    ],
  },
});

// Security Group
stack.addResource('WebServerSecurityGroup', {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    GroupDescription: 'Security group for web servers',
    SecurityGroupIngress: [
      {
        IpProtocol: 'tcp', //
        FromPort: 80,
        ToPort: 80,
        CidrIp: '0.0.0.0/0',
      },
    ],
    Tags: [
      Tag('Name', 'Web server security group'), //
    ],
  },
});

console.log(stack.json());
