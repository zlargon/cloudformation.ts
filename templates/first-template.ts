#!/usr/bin/env -S deno run
import { Stack } from '../src/Stack.ts';
import { NameTag, NameTagSub, Tag, TagSub } from '../src/Tag.ts';

const stack = Stack('Our first template in CloudFormation course.');

// ========================================================
// Parameters
// ========================================================
const InstanceType = stack.addParameter('InstanceType', {
  Type: 'String',
  Description: 'EC2 instance type',
  Default: 't2.micro',
});

// ========================================================
// Resources
// ========================================================

// Security Group
const WebServerSecurityGroup = stack.addResource('WebServerSecurityGroup', {
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
    Tags: [NameTag('Web server security group')],
  },
});

// EC2 Instance
const WebServerInstance = stack.addResource('WebServerInstance', {
  Type: 'AWS::EC2::Instance',
  Properties: {
    ImageId: 'ami-0b5eea76982371e91',
    InstanceType: InstanceType.Ref(),
    SecurityGroupIds: [
      WebServerSecurityGroup.Ref(), //
    ],
    Tags: [
      NameTagSub('${AWS::StackName}-web-server'),
      TagSub('Name2', '${AWS::StackName}-web-server-${instanceType}-${str}-${num}', {
        instanceType: InstanceType.Ref(),
        str: 'hello',
        num: 123,
      }),
      TagSub('Name3', 'web-server-${str}-${str}-${num}-${!num}', {
        str: 'hello',
        num: 123,
      }),
      Tag('Project', 'CloudFormation Step By Step'),
    ],
  },
});

// SQS Queue
stack.addResource('SQSQueue', {
  Type: 'AWS::SQS::Queue',
  DependsOn: WebServerInstance.Name(),
});

console.log(stack.json());
