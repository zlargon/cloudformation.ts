#!/usr/bin/env -S deno run
import { Fn_Equals } from '../src/Conditions.ts';
import { Fn_If } from '../src/Fn_If.ts';
import { Stack } from '../src/Stack.ts';

// create stack
const stack = Stack();
stack.setDescription(`
A database stack template that creates a master RDS instance and a read replica.
It also provisions a security group and attaches to the db instances.`);

// ========================================================
// Parameters
// ========================================================
const DbSubnets = stack.addParameter('DbSubnets', {
  Type: 'List<AWS::EC2::Subnet::Id>',
  Description: 'Db subnet ids as a list: <subnet1>,<subnet2>,...',
});

const VpcId = stack.addParameter('VpcId', {
  Type: 'AWS::EC2::VPC::Id',
  Description: 'A valid VPC id in your AWS account',
});

const Environment = stack.addParameter('Environment', {
  Type: 'String',
  AllowedValues: [
    'test', //
    'production',
  ],
});

// ========================================================
// Metadata
// ========================================================
stack.metadata.addParameterGroup('Network Settings', [
  VpcId.Name(), //
  DbSubnets.Name(),
]);

// ========================================================
// Condition
// ========================================================
const EnvironmentIsProduction = stack.addCondition(
  'EnvironmentIsProduction',
  Fn_Equals(Environment.Ref(), 'production')
);

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

const MasterDbInstance = stack.addResource('MasterDbInstance', {
  Type: 'AWS::RDS::DBInstance',
  Properties: {
    DBInstanceClass: Fn_If(EnvironmentIsProduction.Condition(), {
      Then: 'db.t2.small',
      Else: 'db.t2.micro',
    }),
    Engine: 'mysql',
    MultiAZ: false,
    PubliclyAccessible: true,
    AllocatedStorage: 8,
    MasterUsername: 'dbadmin',
    MasterUserPassword: 'dbpassword',
    DBSubnetGroupName: DbSubnetGroup.Ref(),
    VPCSecurityGroups: [DbSecurityGroup.Ref()],
  },
});

stack.addResource('ReadReplica', {
  Type: 'AWS::RDS::DBInstance',
  Condition: EnvironmentIsProduction.Condition(),
  Properties: {
    SourceDBInstanceIdentifier: MasterDbInstance.Ref(),
    DBInstanceClass: 'db.t2.micro',
    Engine: 'mysql',
    PubliclyAccessible: true,
    VPCSecurityGroups: [DbSecurityGroup.Ref()],
  },
});

// ========================================================
// Outputs
// ========================================================
stack.addOutput('MasterDbId', {
  Value: MasterDbInstance.Ref(),
  Description: 'Master database instance identifier',
});

console.log(stack.json());
