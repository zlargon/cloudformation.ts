#!/usr/bin/env -S deno run
import { createStack } from '../src/Stack.ts';
import { NameTag } from '../src/Tag.ts';

const stack = createStack({
  Description: 'Section 2 activity solution template',
});

// VPC
const ActivityVpc = stack.addResource('ActivityVpc', {
  Type: 'AWS::EC2::VPC',
  Description: 'Section 2 activity VPC definition',
  Properties: {
    CidrBlock: '10.0.0.0/16',
    Tags: [NameTag('Section2ActivityVPC')],
  },
});

// Subnet
const ActivitySubnet = stack.addResource('ActivitySubnet', {
  Type: 'AWS::EC2::Subnet',
  Properties: {
    CidrBlock: '10.0.0.0/24',
    MapPublicIpOnLaunch: true,
    VpcId: ActivityVpc.Ref(),
  },
});

// RouteTable
const ActivityRouteTable = stack.addResource('ActivityRouteTable', {
  Type: 'AWS::EC2::RouteTable',
  Properties: {
    VpcId: ActivityVpc.Ref(),
  },
});

// InternetGateway
const ActivityInternetGateway = stack.addResource('ActivityInternetGateway', {
  Type: 'AWS::EC2::InternetGateway',
});

// VPCGatewayAttachment
const ActivityGatewayAttachment = stack.addResource('ActivityGatewayAttachment', {
  Type: 'AWS::EC2::VPCGatewayAttachment',
  Properties: {
    VpcId: ActivityVpc.Ref(),
    InternetGatewayId: ActivityInternetGateway.Ref(),
  },
});

// Route
const InternetRoute = stack.addResource('InternetRoute', {
  Type: 'AWS::EC2::Route',
  DependsOn: [
    ActivityGatewayAttachment.Name(), //
  ],
  Properties: {
    RouteTableId: ActivityRouteTable.Ref(),
    GatewayId: ActivityInternetGateway.Ref(),
    DestinationCidrBlock: '0.0.0.0/0',
  },
});

// SubnetRouteTableAssociation
const ActivitySubnetRouteTableAssoc = stack.addResource('ActivitySubnetRouteTableAssoc', {
  Type: 'AWS::EC2::SubnetRouteTableAssociation',
  Properties: {
    RouteTableId: ActivityRouteTable.Ref(),
    SubnetId: ActivitySubnet.Ref(),
  },
});

// Security Group
const ActivitySecurityGroup = stack.addResource('ActivitySecurityGroup', {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    GroupDescription: 'Activity security group',
    VpcId: ActivityVpc.Ref(),
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0',
        IpProtocol: 'icmp',
        FromPort: -1,
        ToPort: -1,
      },
    ],
  },
});

// EC2 instance
stack.addResource('ActivityInstance', {
  Type: 'AWS::EC2::Instance',
  DependsOn: [
    InternetRoute.Name(), //
    ActivitySubnetRouteTableAssoc.Name(),
  ],
  Properties: {
    InstanceType: 't2.micro',
    SubnetId: ActivitySubnet.Ref(),
    ImageId: 'ami-0b5eea76982371e91',
    SecurityGroupIds: [
      ActivitySecurityGroup.Ref(), //
    ],
  },
});

console.log(stack.json());
