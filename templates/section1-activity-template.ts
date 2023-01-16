#!/usr/bin/env -S deno run
import { PartitionKey, StringAttribute } from '../src/DynamoDB_Table.ts';
import { Stack } from '../src/Stack.ts';

const stack = Stack('Section 1 activity template - AWS CloudFormation Step by Step: Beginner to Intermediate');

// Dynamodb: SampleTable
stack.addResource('SampleTable', {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: 'section1-activity-table',
    AttributeDefinitions: [StringAttribute('id')],
    KeySchema: [PartitionKey('id')],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  },
});

// RDS instance: SampleRDSInstance
stack.addResource('SampleRDSInstance', {
  Type: 'AWS::RDS::DBInstance',
  DeletionPolicy: 'Delete',
  Properties: {
    Engine: 'mariadb',
    DBInstanceClass: 'db.t2.micro',
    DBInstanceIdentifier: 'section1-activity-db',
    MultiAZ: false,
    MasterUsername: 'dbadmin',
    MasterUserPassword: 'mystrongpassword',
    AllocatedStorage: 8,
    StorageType: 'gp2',
    BackupRetentionPeriod: 0,
  },
});

console.log(stack.json());
