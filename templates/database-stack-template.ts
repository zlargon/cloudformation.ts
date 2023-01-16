#!/usr/bin/env -S deno run
import { Stack } from '../src/Stack.ts';

const stack = Stack('Sample database stack for the Parameters section');

// ========================================================
// Parameters
// ========================================================
const DbClass = stack.addParameter('DbClass', {
  Type: 'String',
  Description: 'RDS instance class',
  AllowedValues: ['db.t2.micro', 'db.t2.small'],
  ConstraintDescription: 'DbClass parameter can only to be db.t2.micro, db.t2.small',
  Default: 'db.t2.micro',
});

const MasterUsername = stack.addParameter('MasterUsername', {
  Type: 'String',
  Description: 'Master username for the db instance',
  MaxLength: 10,
  Default: 'dbadmin',
  AllowedPattern: '[a-zA-Z][a-zA-Z0-9]*',
});

const MasterUserPassword = stack.addParameter('MasterUserPassword', {
  Type: 'String',
  Description: 'Master user password for the db instance',
  MinLength: 8,
  NoEcho: true,
});

const MultiAZ = stack.addParameter('MultiAZ', {
  Type: 'String',
  Description: 'Enable Multi-AZ?',
  AllowedValues: ['true', 'false'],
  ConstraintDescription: 'MultiAZ parameter should be either true or false.',
  Default: 'false',
});

const AllocatedStorage = stack.addParameter('AllocatedStorage', {
  Type: 'Number',
  Description: 'Database storage size in GB',
  MinValue: 8,
  MaxValue: 20,
  ConstraintDescription: 'AllocatedStorage parameter value should be between 8 and 20.',
  Default: '8',
});

// ========================================================
// Resources
// ========================================================
const DbSecurityGroup = stack.addResource('DbSecurityGroup', {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    // Note: Please replace the value of VpcId property with the VPC id of your default VPC
    VpcId: 'vpc-0f68633eddd78fd56', // default vpc
    GroupDescription: 'Database instances security group',
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0',
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
    SubnetIds: [
      // Note: Please replace the value of SubnetIds property with the subnet ids of the subnets in your default VPC!
      'subnet-0cc9fb7c1b70c570d',
      'subnet-0ceeb2182a2063f9d',
      'subnet-0acd8489903e7a0fb',
      'subnet-09227140fb95e095d',
      'subnet-0d08f018f7b018712',
      'subnet-061ed6fc8545869bd',
    ],
  },
});

// mysql -u dbadmin -p12345678 -h xxxx.xxxx.us-east-1.rds.amazonaws.com
stack.addResource('DatabaseInstance', {
  Type: 'AWS::RDS::DBInstance',
  Properties: {
    DBInstanceClass: DbClass.Ref(),
    Engine: 'mysql',
    MultiAZ: MultiAZ.Ref(),
    PubliclyAccessible: true,
    AllocatedStorage: AllocatedStorage.Ref(),
    MasterUsername: MasterUsername.Ref(),
    MasterUserPassword: MasterUserPassword.Ref(),
    DBSubnetGroupName: DbSubnetGroup.Ref(),
    VPCSecurityGroups: [
      DbSecurityGroup.Ref(), //
    ],
  },
});

console.log(stack.json());
