#!/usr/bin/env -S deno run
import { Stack } from '../src/Stack.ts';
import { Tag } from '../src/Tag.ts';
import { Ref } from '../src/Ref.ts';

const Constant = {
  WebServerInstance: 'WebServerInstance',
  WebSecurityGroup: 'WebServerSecurityGroup',
  SQSQueue: 'SQSQueue',
};

// create stack
const stack = Stack();
stack.setDescription('Our first template in CloudFormation course.');

// EC2 Instance
stack.addResource(Constant.WebServerInstance, {
  Type: 'AWS::EC2::Instance',
  Properties: {
    ImageId: 'ami-0b5eea76982371e91',
    InstanceType: 't2.micro',
    SecurityGroupIds: [
      Ref(Constant.WebSecurityGroup), //
    ],
    Tags: [
      Tag('Name', 'Web server'), //
      Tag('Project', 'CloudFormation Step By Step'),
    ],
  },
});

// Security Group
stack.addResource(Constant.WebSecurityGroup, {
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

// SQS Queue
stack.addResource(Constant.SQSQueue, {
  Type: 'AWS::SQS::Queue',
  DependsOn: Constant.WebServerInstance,
});

console.log(stack.json());
