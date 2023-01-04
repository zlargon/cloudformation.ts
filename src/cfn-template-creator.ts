import { create_dynamodb_table_resource, DynamoDBTableResource } from './dynamodb/dynamodb.ts';
import { create_rds_db_instance_resource, RdsDbInstanceResource } from './rds/rds.ts';
import { create_sns_topic_resource, SnsTopicResource } from './sns/sns.ts';
import { create_sqs_queue_resource } from './sqs/sqs.ts';

interface Stack {
  Description: string;
}

export const create_stack = ({ Description }: Stack) => {
  const Resources: Record<string, unknown> = {};

  return {
    resource: {
      add_sqs_queue(name: string) {
        Resources[name] = create_sqs_queue_resource();
      },

      add_sns_topic(name: string, resource: SnsTopicResource) {
        Resources[name] = create_sns_topic_resource(resource);
      },

      add_dynamodb_table(name: string, resource: DynamoDBTableResource) {
        Resources[name] = create_dynamodb_table_resource(resource);
      },

      add_rds_db_instance(name: string, resource: RdsDbInstanceResource) {
        Resources[name] = create_rds_db_instance_resource(resource);
      },
    },

    json() {
      const stack = {
        AWSTemplateFormatVersion: '2010-09-09',
        Description,
        Resources,
      };
      return JSON.stringify(stack, null, 4);
    },
  };
};
