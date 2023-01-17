#!/usr/bin/env -S deno run
import { Fn_GetAZs } from '../src/Fn_GetAZs.ts';
import { Fn_Join } from '../src/Fn_Join.ts';
import { Fn_Select } from '../src/Fn_Select.ts';
import { Fn_Sub } from '../src/Fn_Sub.ts';
import { PseudoParameter } from '../src/PseudoParameter.ts';
import { Ref } from '../src/Ref.ts';
import { Stack } from '../src/Stack.ts';
import { NameTagSub } from '../src/Tag.ts';

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
    Tags: [NameTagSub('${AWS::StackName}-VPC')],
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
    Tags: [NameTagSub('${AWS::StackName}-PublicRouteTable')],
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
    Tags: [NameTagSub('${AWS::StackName}-PrivateRouteTable')],
  },
});

// ========================================================
// Subnets
// ========================================================
function createSubnetWithRouteTable(params: {
  Stack: Stack;
  SubnetName: string;
  AZIndex: number;
  CidrBlock: string;
  RouteTableRef: Ref;
  MapPublicIpOnLaunch?: boolean;
}) {
  const { Stack, SubnetName, AZIndex, CidrBlock, RouteTableRef, MapPublicIpOnLaunch } = params;

  const Subnet = Stack.addResource(SubnetName, {
    Type: 'AWS::EC2::Subnet',
    Properties: {
      AvailabilityZone: Fn_Select({
        Options: Fn_GetAZs(PseudoParameter.Region.Ref()), //
        Index: AZIndex,
      }),
      CidrBlock,
      MapPublicIpOnLaunch,
      VpcId: Vpc.Ref(),
      Tags: [NameTagSub(`\${AWS::StackName}-${SubnetName}`)],
    },
  });

  Stack.addResource(`${SubnetName}RouteTblAscn`, {
    Type: 'AWS::EC2::SubnetRouteTableAssociation',
    Properties: {
      RouteTableId: RouteTableRef,
      SubnetId: Subnet.Ref(),
    },
  });

  return Subnet;
}

const PublicSubnet1 = createSubnetWithRouteTable({
  Stack: stack,
  SubnetName: 'PublicSubnet1',
  AZIndex: 0,
  CidrBlock: '10.0.0.0/24',
  MapPublicIpOnLaunch: true,
  RouteTableRef: PublicRouteTable.Ref(),
});

const PublicSubnet2 = createSubnetWithRouteTable({
  Stack: stack,
  SubnetName: 'PublicSubnet2',
  AZIndex: 1,
  CidrBlock: '10.0.1.0/24',
  MapPublicIpOnLaunch: true,
  RouteTableRef: PublicRouteTable.Ref(),
});

const PrivateSubnet1 = createSubnetWithRouteTable({
  Stack: stack,
  SubnetName: 'PrivateSubnet1',
  AZIndex: 0,
  CidrBlock: '10.0.2.0/24',
  RouteTableRef: PrivateRouteTable.Ref(),
});

const PrivateSubnet2 = createSubnetWithRouteTable({
  Stack: stack,
  SubnetName: 'PrivateSubnet2',
  AZIndex: 1,
  CidrBlock: '10.0.3.0/24',
  RouteTableRef: PrivateRouteTable.Ref(),
});

// ========================================================
// Security groups
// ========================================================
const AppSecurityGroup = stack.addResource('AppSecurityGroup', {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    VpcId: Vpc.Ref(),
    GroupDescription: 'Security group for application instances',
    Tags: [NameTagSub('${AWS::StackName}-AppSecurityGroup')],
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
    Tags: [NameTagSub('${AWS::StackName}-DbSecurityGroup')],
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
  Export: {
    Name: Fn_Sub('${AWS::StackName}-PrivateSubnets'),
  },
});

stack.addOutput('DbSecurityGroup', {
  Description: 'ID of the DB security group',
  Value: DbSecurityGroup.Ref(),
  Export: {
    Name: Fn_Sub('${AWS::StackName}-DbSecurityGroup'),
  },
});

console.log(stack.json());
