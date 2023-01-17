#!/usr/bin/env -S deno run
import { Fn_GetAZs } from '../src/Fn_GetAZs.ts';
import { Fn_Join } from '../src/Fn_Join.ts';
import { Fn_Select } from '../src/Fn_Select.ts';
import { Fn_Sub } from '../src/Fn_Sub.ts';
import { PseudoParameter } from '../src/PseudoParameter.ts';
import { Stack } from '../src/Stack.ts';
import { NameTag } from '../src/Tag.ts';

const stack = Stack(`
Network stack template for
AWS CloudFormation Step by Step: Intermediate to Advanced course.`);

// ========================================================
// Resources
// ========================================================
const Vpc = stack.addResource('Vpc', {
  Type: 'AWS::EC2::VPC',
  Properties: {
    CidrBlock: '10.0.0.0/16',
    Tags: [NameTag(Fn_Sub('${AWS::StackName}-VPC'))],
  },
});

// ========================================================
// Route tables
// ========================================================
const PublicRouteTable = stack.addResource('PublicRouteTable', {
  Type: 'AWS::EC2::RouteTable',
  Description: 'A route table that has a route to the Internet',
  Properties: {
    VpcId: Vpc.Ref(),
    Tags: [NameTag(Fn_Sub('${AWS::StackName}-PublicRouteTable'))],
  },
});

const InternetGateway = stack.addResource('InternetGateway', {
  Type: 'AWS::EC2::InternetGateway',
});

const InternetGatewayAttachment = stack.addResource('InternetGatewayAttachment', {
  Type: 'AWS::EC2::VPCGatewayAttachment',
  Description: 'Internet gateway attachment to the VPC',
  Properties: {
    InternetGatewayId: InternetGateway.Ref(),
    VpcId: Vpc.Ref(),
  },
});

stack.addResource('InternetRoute', {
  Type: 'AWS::EC2::Route',
  DependsOn: InternetGatewayAttachment.Name(),
  Properties: {
    DestinationCidrBlock: '0.0.0.0/0',
    GatewayId: InternetGateway.Ref(),
    RouteTableId: PublicRouteTable.Ref(),
  },
});

const PrivateRouteTable = stack.addResource('PrivateRouteTable', {
  Type: 'AWS::EC2::RouteTable',
  Description: 'A route table that does not have a route to the Internet',
  Properties: {
    VpcId: Vpc.Ref(),
    Tags: [NameTag(Fn_Sub('${AWS::StackName}-PrivateRouteTable'))],
  },
});

// ========================================================
// Subnets
// ========================================================
const PublicSubnet1 = stack.addResource('PublicSubnet1', {
  Type: 'AWS::EC2::Subnet',
  Properties: {
    AvailabilityZone: Fn_Select({
      Options: Fn_GetAZs(PseudoParameter.Region.Ref()), //
      Index: 0,
    }),
    CidrBlock: '10.0.0.0/24',
    MapPublicIpOnLaunch: true,
    VpcId: Vpc.Ref(),
    Tags: [NameTag(Fn_Sub('${AWS::StackName}-PublicSubnet1'))],
  },
});

stack.addResource('PublicSubnet1RouteTblAscn', {
  Type: 'AWS::EC2::SubnetRouteTableAssociation',
  Properties: {
    RouteTableId: PublicRouteTable.Ref(),
    SubnetId: PublicSubnet1.Ref(),
  },
});

const PublicSubnet2 = stack.addResource('PublicSubnet2', {
  Type: 'AWS::EC2::Subnet',
  Properties: {
    AvailabilityZone: Fn_Select({
      Options: Fn_GetAZs(PseudoParameter.Region.Ref()), //
      Index: 1,
    }),
    CidrBlock: '10.0.1.0/24',
    MapPublicIpOnLaunch: true,
    VpcId: Vpc.Ref(),
    Tags: [NameTag(Fn_Sub('${AWS::StackName}-PublicSubnet2'))],
  },
});

stack.addResource('PublicSubnet2RouteTblAscn', {
  Type: 'AWS::EC2::SubnetRouteTableAssociation',
  Properties: {
    RouteTableId: PublicRouteTable.Ref(),
    SubnetId: PublicSubnet2.Ref(),
  },
});

const PrivateSubnet1 = stack.addResource('PrivateSubnet1', {
  Type: 'AWS::EC2::Subnet',
  Properties: {
    AvailabilityZone: Fn_Select({
      Options: Fn_GetAZs(PseudoParameter.Region.Ref()), //
      Index: 0,
    }),
    CidrBlock: '10.0.2.0/24',
    VpcId: Vpc.Ref(),
    Tags: [NameTag(Fn_Sub('${AWS::StackName}-PrivateSubnet1'))],
  },
});

stack.addResource('PrivateSubnet1RouteTblAscn', {
  Type: 'AWS::EC2::SubnetRouteTableAssociation',
  Properties: {
    RouteTableId: PrivateRouteTable.Ref(),
    SubnetId: PrivateSubnet1.Ref(),
  },
});

const PrivateSubnet2 = stack.addResource('PrivateSubnet2', {
  Type: 'AWS::EC2::Subnet',
  Properties: {
    AvailabilityZone: Fn_Select({
      Options: Fn_GetAZs(PseudoParameter.Region.Ref()), //
      Index: 1,
    }),
    CidrBlock: '10.0.3.0/24',
    VpcId: Vpc.Ref(),
    Tags: [NameTag(Fn_Sub('${AWS::StackName}-PrivateSubnet2'))],
  },
});

stack.addResource('PrivateSubnet2RouteTblAscn', {
  Type: 'AWS::EC2::SubnetRouteTableAssociation',
  Properties: {
    RouteTableId: PrivateRouteTable.Ref(),
    SubnetId: PrivateSubnet2.Ref(),
  },
});

// ========================================================
// Security groups
// ========================================================
const AppSecurityGroup = stack.addResource('AppSecurityGroup', {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    VpcId: Vpc.Ref(),
    GroupDescription: 'Security group for application instances',
    Tags: [NameTag(Fn_Sub('${AWS::StackName}-AppSecurityGroup'))],
  },
});

const DbSecurityGroup = stack.addResource('DbSecurityGroup', {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    VpcId: Vpc.Ref(),
    GroupDescription: 'Security group for DB instances',
    SecurityGroupIngress: [
      {
        SourceSecurityGroupId: AppSecurityGroup.Ref(),
        FromPort: 3306,
        ToPort: 3306,
        IpProtocol: 'tcp',
      },
    ],
    Tags: [NameTag(Fn_Sub('${AWS::StackName}-DbSecurityGroup'))],
  },
});

// ========================================================
// Outputs
// ========================================================
stack.addOutput('VpcId', {
  Value: Vpc.Ref(),
});

stack.addOutput('PublicSubnets', {
  Description: 'Public subnet IDs as comma-delimited',
  Value: Fn_Join({
    Values: [PublicSubnet1.Ref(), PublicSubnet2.Ref()],
    Delimiter: ',',
  }),
});

stack.addOutput('PrivateSubnets', {
  Description: 'Private subnet IDs as comma-delimited',
  Value: Fn_Join({
    Values: [PrivateSubnet1.Ref(), PrivateSubnet2.Ref()],
    Delimiter: ',',
  }),
});

stack.addOutput('DbSecurityGroup', {
  Description: 'ID of the DB security group',
  Value: DbSecurityGroup.Ref(),
});

console.log(stack.json());
