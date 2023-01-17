#!/usr/bin/env -S deno run
import { Fn_ImportValueSub } from '../src/Fn_ImportValue.ts';
import { Fn_Split } from '../src/Fn_Split.ts';
import { Stack } from '../src/Stack.ts';

const stack = Stack(`
Database stack template for
AWS CloudFormation Step by Step: Intermediate to Advanced course.`);

// ========================================================
// Parameters
// ========================================================
const NetworkStackName = stack.addParameter('NetworkStackName', {
  Type: 'String',
  Description: 'The name of the network stack referenced',
});

const AllocatedStorage = stack.addParameter('AllocatedStorage', {
  Type: 'Number',
  Description: 'Database storage in GiB',
  MinValue: 8,
  MaxValue: 20,
  Default: 8,
});

const DbClass = stack.addParameter('DbClass', {
  Type: 'String',
  AllowedValues: [
    'db.t2.micro', //
    'db.t2.small',
  ],
  Description: 'Amazon RDS DB instance class',
  Default: 'db.t2.micro',
});

// ========================================================
// Metadata
// ========================================================
stack.metadata.addParameterGroup('Database Instance Settings', [
  AllocatedStorage.Name(), //
  DbClass.Name(),
]);

stack.metadata.addParameterGroup('Network Settings', [
  NetworkStackName.Name(), //
]);

// ========================================================
// Resources
// ========================================================
const DbSubnetGroup = stack.addResource('DbSubnetGroup', {
  Type: 'AWS::RDS::DBSubnetGroup',
  Properties: {
    DBSubnetGroupDescription: 'The subnets to launch the db instance into.',
    SubnetIds: Fn_Split({
      Source: Fn_ImportValueSub('${NetworkStackName}-PrivateSubnets'),
      Delimiter: ',',
    }),
  },
});

stack.addResource('DbInstance', {
  Type: 'AWS::RDS::DBInstance',
  Properties: {
    DBInstanceClass: DbClass.Ref(),
    Engine: 'mysql',
    MultiAZ: false,
    AllocatedStorage: AllocatedStorage.Ref(),
    MasterUsername: 'dbadmin',
    MasterUserPassword: 'dbpassword',
    DBSubnetGroupName: DbSubnetGroup.Ref(),
    VPCSecurityGroups: [
      Fn_ImportValueSub('${NetworkStackName}-DbSecurityGroup'), //
    ],
  },
});

console.log(stack.json());
