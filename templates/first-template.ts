#!/usr/bin/env -S deno run
import { Stack } from '../src/Stack.ts';
import { Tag } from '../src/Tag.ts';
import { Ref } from '../src/Ref.ts';

// define all the resource names
const MyResource = {
  WebServerInstance: 'WebServerInstance',
  WebSecurityGroup: 'WebServerSecurityGroup',
  SQSQueue: 'SQSQueue',
};

// create stack
const stack = Stack();
stack.setDescription('Our first template in CloudFormation course.');

// EC2 Instance
stack.addResource(MyResource.WebServerInstance, {
  Type: 'AWS::EC2::Instance',
  Properties: {
    ImageId: 'ami-0b5eea76982371e91',
    InstanceType: 't2.micro',
    SecurityGroupIds: [
      Ref(MyResource.WebSecurityGroup), //
    ],
    Tags: [
      Tag('Name', 'Web server'), //
      Tag('Project', 'CloudFormation Step By Step'),
    ],
  },
});

// Security Group
stack.addResource(MyResource.WebSecurityGroup, {
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
stack.addResource(MyResource.SQSQueue, {
  Type: 'AWS::SQS::Queue',
  DependsOn: MyResource.WebServerInstance,
});

console.log(stack.json());
