#!/usr/bin/env -S deno run
import { Stack } from '../src/Stack.ts';

// create stack
const stack = Stack();
stack.setDescription('Sample database stack template for Change Sets section creating an Amazon RDS instance.');

// ========================================================
// Parameters
// ========================================================
const DbSubnets = stack.addParameter('DbSubnets', {
  Type: 'List<AWS::EC2::Subnet::Id>',
  Description: 'Subnets that the database instances will be launched into',
});

const VpcId = stack.addParameter('VpcId', {
  Type: 'AWS::EC2::VPC::Id',
  Description: 'A valid VPC id in your AWS account',
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
  AllowedValues: ['db.t2.micro', 'db.t2.small'],
  Description: 'Amazon RDS instance class',
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
  VpcId.Name(), //
  DbSubnets.Name(),
]);

// ========================================================
// Resources
// ========================================================
const DbSecurityGroup = stack.addResource('DbSecurityGroup', {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    VpcId: VpcId.Ref(),
    GroupDescription: 'Database instances security group',
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0', //
        FromPort: 3306,
        ToPort: 3306,
        IpProtocol: 'tcp',
      },
    ],
  },
});

const DbSubnetGroup = stack.addResource('DbSubnetGroup', {
  Type: 'AWS::RDS::DBSubnetGroup',
  Properties: {
    DBSubnetGroupDescription: 'Subnets to launch db instances into',
    SubnetIds: DbSubnets.Ref(),
  },
});

stack.addResource('MasterDbInstance', {
  Type: 'AWS::RDS::DBInstance',
  Properties: {
    DBInstanceClass: DbClass.Ref(),
    Engine: 'mysql',
    MultiAZ: false,
    PubliclyAccessible: true,
    AllocatedStorage: AllocatedStorage.Ref(),
    MasterUsername: 'dbadmin',
    MasterUserPassword: 'dbpassword',
    DBSubnetGroupName: DbSubnetGroup.Ref(),
    VPCSecurityGroups: [DbSecurityGroup.Ref()],
  },
});

console.log(stack.json());
