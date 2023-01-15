#!/usr/bin/env -S deno run
import { Fn_Select } from '../src/Fn_Select.ts';
import { Fn_Sub } from '../src/Fn_Sub.ts';
import { Ref } from '../src/Ref.ts';
import { Stack } from '../src/Stack.ts';
import { Tag } from '../src/Tag.ts';

const stack = Stack();
stack.setDescription('Sample database stack for the Metadata and Mappings section');

const Constant = {
  // Parameters
  DbClass: 'DbClass',
  MasterUsername: 'MasterUsername',
  MasterUserPassword: 'MasterUserPassword',
  MultiAZ: 'MultiAZ',
  AllocatedStorage: 'AllocatedStorage',
  SecurityGroupPorts: 'SecurityGroupPorts',
  DbSubnets: 'DbSubnets',
  VpcId: 'VpcId',

  // Resources
  Bastion: 'Bastion',
  WebServerSecurityGroup: 'WebServerSecurityGroup',
  DbSecurityGroup: 'DbSecurityGroup',
  DbSubnetGroup: 'DbSubnetGroup',
  DatabaseInstance: 'DatabaseInstance',
};

// ==============================================
// Metadata
// ==============================================
stack.metadata.addParameterGroup('Database Instance Settings', [
  Constant.DbClass,
  Constant.MultiAZ,
  Constant.AllocatedStorage,
  Constant.MasterUsername,
  Constant.MasterUserPassword,
]);
stack.metadata.addParameterGroup('Network Settings', [
  Constant.VpcId, //
  Constant.DbSubnets,
  Constant.SecurityGroupPorts,
]);

// ==============================================
// Parameters
// ==============================================
stack.metadata.setParameterLabel(Constant.DbClass, 'Database Instance Class');
stack.addParameter(Constant.DbClass, {
  Type: 'String',
  Description: 'RDS instance class',
  AllowedValues: [
    'db.t2.micro', //
    'db.t2.small',
  ],
  ConstraintDescription: 'DbClass parameter can only have these values: db.t2.micro, db.t2.small',
  Default: 'db.t2.micro',
});

stack.addParameter(Constant.MasterUsername, {
  Type: 'String',
  Description: 'Master username for the db instance',
  MaxLength: 10,
  Default: 'dbadmin',
  AllowedPattern: '[a-zA-Z][a-zA-Z0-9]*',
});

stack.addParameter(Constant.MasterUserPassword, {
  Type: 'String',
  Description: 'Master user password for the db instance',
  MinLength: 8,
  NoEcho: true,
});

stack.addParameter(Constant.MultiAZ, {
  Type: 'String',
  Description: 'Enable Multi-AZ?',
  AllowedValues: [true, false],
  ConstraintDescription: 'MultiAZ parameter should be either true or false.',
  Default: false,
});

stack.metadata.setParameterLabel(Constant.AllocatedStorage, 'Allocated Storage Size');
stack.addParameter(Constant.AllocatedStorage, {
  Type: 'Number',
  Description: 'Database storage size in GB',
  MinValue: 8,
  MaxValue: 20,
  ConstraintDescription: 'AllocatedStorage parameter value should be between 8 and 20.',
  Default: 8,
});

stack.addParameter(Constant.SecurityGroupPorts, {
  Type: 'List<Number>',
  Description: 'Port numbers as a list: <web-server-port>,<database-port>',
  Default: '80,3306',
});

stack.addParameter(Constant.DbSubnets, {
  Type: 'List<AWS::EC2::Subnet::Id>',
  Description: 'Db subnet ids as a list: <subnet1>,<subnet2>,...',
});

stack.addParameter(Constant.VpcId, {
  Type: 'AWS::EC2::VPC::Id',
  Description: 'A valid VPC id in your AWS account',
});

// ==============================================
// Resources
// ==============================================
stack.addResource(Constant.Bastion, {
  Type: 'AWS::EC2::Instance',
  Properties: {
    ImageId: 'ami-02a39bdb8e8ee056a',
    InstanceType: 't2.micro',
    SubnetId: Fn_Select(0, Ref(Constant.DbSubnets)),
    Tags: [
      Tag('Name', Fn_Sub('${AWS::StackName}-Bastion')), //
    ],
  },
});

stack.addResource(Constant.WebServerSecurityGroup, {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    VpcId: Ref(Constant.VpcId),
    GroupDescription: 'Web server instances security group',
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0',
        FromPort: Fn_Select(0, Ref(Constant.SecurityGroupPorts)),
        ToPort: Fn_Select(0, Ref(Constant.SecurityGroupPorts)),
        IpProtocol: 'tcp',
      },
    ],
  },
});

// Note: Please replace the value of VpcId property with the VPC id of your default VPC
stack.addResource(Constant.DbSecurityGroup, {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    VpcId: Ref(Constant.VpcId),
    GroupDescription: 'Database instances security group',
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0',
        FromPort: Fn_Select(1, Ref(Constant.SecurityGroupPorts)),
        ToPort: Fn_Select(1, Ref(Constant.SecurityGroupPorts)),
        IpProtocol: 'tcp',
      },
    ],
  },
});

// Note: Please replace the value of SubnetIds property with the subnet ids of the subnets in your default VPC!
stack.addResource(Constant.DbSubnetGroup, {
  Type: 'AWS::RDS::DBSubnetGroup',
  Properties: {
    DBSubnetGroupDescription: 'Subnets to launch db instances into',
    SubnetIds: Ref(Constant.DbSubnets),
  },
});

stack.addResource(Constant.DatabaseInstance, {
  Type: 'AWS::RDS::DBInstance',
  Properties: {
    DBInstanceClass: Ref(Constant.DbClass),
    Engine: 'mariadb',
    MultiAZ: Ref(Constant.MultiAZ),
    PubliclyAccessible: true,
    AllocatedStorage: Ref(Constant.AllocatedStorage),
    MasterUsername: Ref(Constant.MasterUsername),
    MasterUserPassword: Ref(Constant.MasterUserPassword),
    DBSubnetGroupName: Ref(Constant.DbSubnetGroup),
    VPCSecurityGroups: [
      Ref(Constant.DbSecurityGroup), //
    ],
  },
});

console.log(stack.json());
