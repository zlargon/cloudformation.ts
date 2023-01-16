#!/usr/bin/env -S deno run
import { Fn_Select } from '../src/Fn_Select.ts';
import { Fn_Sub } from '../src/Fn_Sub.ts';
import { Stack } from '../src/Stack.ts';
import { NameTag } from '../src/Tag.ts';

const stack = Stack();
stack.setDescription('Sample database stack for the Metadata and Mappings section');

// ==============================================
// Parameters
// ==============================================
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
  AllowedValues: [true, false],
  ConstraintDescription: 'MultiAZ parameter should be either true or false.',
  Default: false,
});

const AllocatedStorage = stack.addParameter('AllocatedStorage', {
  Type: 'Number',
  Description: 'Database storage size in GB',
  MinValue: 8,
  MaxValue: 20,
  ConstraintDescription: 'AllocatedStorage parameter value should be between 8 and 20.',
  Default: 8,
});
stack.metadata.addParameterLabel(AllocatedStorage.Name(), 'Allocated Storage Size');

const SecurityGroupPorts = stack.addParameter('SecurityGroupPorts', {
  Type: 'List<Number>',
  Description: 'Port numbers as a list: <web-server-port>,<database-port>',
  Default: '80,3306',
});

const DbSubnets = stack.addParameter('DbSubnets', {
  Type: 'List<AWS::EC2::Subnet::Id>',
  Description: 'Db subnet ids as a list: <subnet1>,<subnet2>,...',
});

const VpcId = stack.addParameter('VpcId', {
  Type: 'AWS::EC2::VPC::Id',
  Description: 'A valid VPC id in your AWS account',
});

const EnvironmentName = stack.addParameter('EnvironmentName', {
  Type: 'String',
  AllowedValues: ['prod', 'test'],
  Default: 'test',
});

// ==============================================
// Metadata
// ==============================================
stack.metadata.addParameterGroup('Database Instance Settings', [
  MultiAZ.Name(),
  AllocatedStorage.Name(),
  MasterUsername.Name(),
  MasterUserPassword.Name(),
]);
stack.metadata.addParameterGroup('Network Settings', [
  VpcId.Name(), //
  DbSubnets.Name(),
  SecurityGroupPorts.Name(),
]);

// ==============================================
// Mappings
// ==============================================
const Fn_FindInEnvironmentMap = stack.addMapping('EnvironmentOptions', {
  prod: { DbClass: 'db.t2.small' },
  test: { DbClass: 'db.t2.micro' },
});

// ==============================================
// Resources
// ==============================================
stack.addResource('Bastion', {
  Type: 'AWS::EC2::Instance',
  Properties: {
    ImageId: 'ami-0b5eea76982371e91',
    InstanceType: 't2.micro',
    SubnetId: Fn_Select({
      Options: DbSubnets.Ref(),
      Index: 0,
    }),
    Tags: [NameTag(Fn_Sub('${AWS::StackName}-Bastion'))],
  },
});

stack.addResource('WebServerSecurityGroup', {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    VpcId: VpcId.Ref(),
    GroupDescription: 'Web server instances security group',
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0',
        FromPort: Fn_Select({
          Options: SecurityGroupPorts.Ref(),
          Index: 0,
        }),
        ToPort: Fn_Select({
          Options: SecurityGroupPorts.Ref(),
          Index: 0,
        }),
        IpProtocol: 'tcp',
      },
    ],
  },
});

// Note: Please replace the value of VpcId property with the VPC id of your default VPC
const DbSecurityGroup = stack.addResource('DbSecurityGroup', {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    VpcId: VpcId.Ref(),
    GroupDescription: 'Database instances security group',
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0',
        FromPort: Fn_Select({
          Options: SecurityGroupPorts.Ref(),
          Index: 1,
        }),
        ToPort: Fn_Select({
          Options: SecurityGroupPorts.Ref(),
          Index: 1,
        }),
        IpProtocol: 'tcp',
      },
    ],
  },
});

// Note: Please replace the value of SubnetIds property with the subnet ids of the subnets in your default VPC!
const DbSubnetGroup = stack.addResource('DbSubnetGroup', {
  Type: 'AWS::RDS::DBSubnetGroup',
  Properties: {
    DBSubnetGroupDescription: 'Subnets to launch db instances into',
    SubnetIds: DbSubnets.Ref(),
  },
});

stack.addResource('DatabaseInstance', {
  Type: 'AWS::RDS::DBInstance',
  Properties: {
    DBInstanceClass: Fn_FindInEnvironmentMap(EnvironmentName.Ref(), 'DbClass'),
    Engine: 'mariadb',
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
