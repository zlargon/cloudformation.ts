#!/usr/bin/env -S deno run
import { createStack } from '../src/Stack.ts';

const stack = createStack({
  Description: 'Sample template for first stack - AWS CloudFormation Step by Step: Beginner to Intermediate',
});
stack.addResource('SampleQueue', { Type: 'AWS::SQS::Queue' });
stack.addResource('SampleTopic', {
  Type: 'AWS::SNS::Topic',
  Properties: {
    DisplayName: 'My Sample Topic',
  },
});

console.log(stack.json());
