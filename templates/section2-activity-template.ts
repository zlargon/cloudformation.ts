#!/usr/bin/env -S deno run
import { Stack } from '../src/Stack.ts';
import { NameTag } from '../src/Tag.ts';
import { Ref } from '../src/Ref.ts';

const Constant = {
  ActivityInstance: 'ActivityInstance',
  ActivityVpc: 'ActivityVpc',
  ActivitySubnet: 'ActivitySubnet',
  ActivityRouteTable: 'ActivityRouteTable',
  ActivityInternetGateway: 'ActivityInternetGateway',
  ActivityGatewayAttachment: 'ActivityGatewayAttachment',
  ActivitySubnetRouteTableAssoc: 'ActivitySubnetRouteTableAssoc',
  ActivitySecurityGroup: 'ActivitySecurityGroup',
  InternetRoute: 'InternetRoute',
};

const stack = Stack();
stack.setDescription('Section 2 activity solution template');

// VPC
stack.addResource(Constant.ActivityVpc, {
  Type: 'AWS::EC2::VPC',
  Description: 'Section 2 activity VPC definition',
  Properties: {
    CidrBlock: '10.0.0.0/16',
    Tags: [NameTag('Section2ActivityVPC')],
  },
});

// Subnet
stack.addResource(Constant.ActivitySubnet, {
  Type: 'AWS::EC2::Subnet',
  Properties: {
    CidrBlock: '10.0.0.0/24',
    MapPublicIpOnLaunch: true,
    VpcId: Ref(Constant.ActivityVpc),
  },
});

// RouteTable
stack.addResource(Constant.ActivityRouteTable, {
  Type: 'AWS::EC2::RouteTable',
  Properties: {
    VpcId: Ref(Constant.ActivityVpc),
  },
});

// InternetGateway
stack.addResource(Constant.ActivityInternetGateway, {
  Type: 'AWS::EC2::InternetGateway',
});

// VPCGatewayAttachment
stack.addResource(Constant.ActivityGatewayAttachment, {
  Type: 'AWS::EC2::VPCGatewayAttachment',
  Properties: {
    VpcId: Ref(Constant.ActivityVpc),
    InternetGatewayId: Ref(Constant.ActivityInternetGateway),
  },
});

// Route
stack.addResource(Constant.InternetRoute, {
  Type: 'AWS::EC2::Route',
  DependsOn: [
    Constant.ActivityGatewayAttachment, //
  ],
  Properties: {
    RouteTableId: Ref(Constant.ActivityRouteTable),
    GatewayId: Ref(Constant.ActivityInternetGateway),
    DestinationCidrBlock: '0.0.0.0/0',
  },
});

// SubnetRouteTableAssociation
stack.addResource(Constant.ActivitySubnetRouteTableAssoc, {
  Type: 'AWS::EC2::SubnetRouteTableAssociation',
  Properties: {
    RouteTableId: Ref(Constant.ActivityRouteTable),
    SubnetId: Ref(Constant.ActivitySubnet),
  },
});

// EC2 instance
stack.addResource(Constant.ActivityInstance, {
  Type: 'AWS::EC2::Instance',
  DependsOn: [
    Constant.InternetRoute, //
    Constant.ActivitySubnetRouteTableAssoc,
  ],
  Properties: {
    InstanceType: 't2.micro',
    SubnetId: Ref(Constant.ActivitySubnet),
    ImageId: 'ami-0b5eea76982371e91',
    SecurityGroupIds: [
      Ref(Constant.ActivitySecurityGroup), //
    ],
  },
});

// Security Group
stack.addResource(Constant.ActivitySecurityGroup, {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    GroupDescription: 'Activity security group',
    VpcId: Ref(Constant.ActivityVpc),
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

console.log(stack.json());
