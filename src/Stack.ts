import { DynamoDB_Table } from './DynamoDB_Table.ts';
import { EC2_Instance } from './EC2_Instance.ts';
import { EC2_SecurityGroup } from './EC2_SecurityGroup.ts';
import { RDS_DBInstance } from './RDS_DBInstance.ts';
import { SNS_Topic } from './SNS_Topic.ts';
import { SQS_Queue } from './SQS_Queue.ts';

// Resource
type Resource =
  | DynamoDB_Table //
  | RDS_DBInstance
  | SQS_Queue
  | SNS_Topic
  | EC2_Instance
  | EC2_SecurityGroup;

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html
interface Stack {
  AWSTemplateFormatVersion: '2010-09-09';
  Description?: string;
  Resources: Record<string, Resource>;
}

export function Stack() {
  const stack: Stack = {
    AWSTemplateFormatVersion: '2010-09-09',
    Description: undefined,
    Resources: {},
  };

  return {
    setDescription(description: string) {
      if (description.length > 1024) {
        throw new Error('must be a literal string that is between 0 and 1024 bytes in length');
      }
      stack.Description = description;
    },

    addResource(name: string, resource: Resource) {
      stack.Resources[name] = resource;
    },

    json() {
      return JSON.stringify(stack, null, 4);
    },
  };
}
