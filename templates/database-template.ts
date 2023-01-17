#!/usr/bin/env -S deno run
import { Stack } from '../src/Stack.ts';

const stack = Stack(`
Database stack template for
AWS CloudFormation Step by Step: Intermediate to Advanced course.`);

// ========================================================
// Parameters
// ========================================================
const DbSubnets = stack.addParameter('DbSubnets', {
  Type: 'List<AWS::EC2::Subnet::Id>',
  Description: 'Subnets that the DB instance will be launched into.',
});

const DbSecurityGroup = stack.addParameter('DbSecurityGroup', {
  Type: 'AWS::EC2::SecurityGroup::Id',
  Description: 'The security group that will be attached to the DB instance.',
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
  DbSecurityGroup.Name(), //
  DbSubnets.Name(),
]);

// ========================================================
// Resources
// ========================================================
const DbSubnetGroup = stack.addResource('DbSubnetGroup', {
  Type: 'AWS::RDS::DBSubnetGroup',
  Properties: {
    DBSubnetGroupDescription: 'The subnets to launch the db instance into.',
    SubnetIds: DbSubnets.Ref(),
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
    VPCSecurityGroups: [DbSecurityGroup.Ref()],
  },
});

console.log(stack.json());
