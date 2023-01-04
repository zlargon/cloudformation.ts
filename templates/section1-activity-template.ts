#!/usr/bin/env -S deno run
import { create_stack } from '../src/cfn-template-creator.ts';

const stack = create_stack({
  Description: 'Section 1 activity template - AWS CloudFormation Step by Step: Beginner to Intermediate',
});

// Dynamodb: SampleTable
stack.resource.add_dynamodb_table('SampleTable', {
  Properties: {
    TableName: 'section1-activity-table',
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }, //
    ],
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }, //
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  },
});

// RDS instance: SampleRDSInstance
stack.resource.add_rds_db_instance('SampleRDSInstance', {
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
