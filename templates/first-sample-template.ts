#!/usr/bin/env -S deno run
import { Stack } from '../src/Stack.ts';

const stack = Stack();
stack.setDescription('Sample template for first stack - AWS CloudFormation Step by Step: Beginner to Intermediate');
stack.addResource('SampleQueue', { Type: 'AWS::SQS::Queue' });
stack.addResource('SampleTopic', {
  Type: 'AWS::SNS::Topic',
  Properties: {
    DisplayName: 'My Sample Topic',
  },
});

console.log(stack.json());
