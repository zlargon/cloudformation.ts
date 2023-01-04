#!/usr/bin/env -S deno run
import { create_stack } from '../src/cfn-template-creator.ts';

const stack = create_stack({
  Description: 'Sample template for first stack - AWS CloudFormation Step by Step: Beginner to Intermediate',
});
stack.resource.add_sqs_queue('SampleQueue');
stack.resource.add_sns_topic('SampleTopic', {
  Properties: {
    DisplayName: 'My Sample Topic',
  },
});

console.log(stack.json());
