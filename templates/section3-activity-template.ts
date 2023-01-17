#!/usr/bin/env -S deno run
import { Stack } from '../src/Stack.ts';
import { NameTag, NameTagSub } from '../src/Tag.ts';
import { Fn_Select } from '../src/Fn_Select.ts';

const stack = Stack(`
Section 3 Activity template.
It launches a VPC with public and private subnets,
a web server EC2 instance in the public subnet
and a security group attached to this EC2 instance.`);

// ==============================================
// Parameters
// ==============================================
const InstanceType = stack.addParameter('InstanceType', {
  Type: 'String',
  Default: 't2.micro',
  AllowedValues: [
    't2.nano', //
    't2.micro',
    't2.small',
  ],
});

const ImageId = stack.addParameter('ImageId', {
  Type: 'AWS::EC2::Image::Id',
  Default: 'ami-0b5eea76982371e91',
});

const EbsVolumeSize = stack.addParameter('EbsVolumeSize', {
  Type: 'Number',
  Default: 20,
  Description: 'Volume size in GiB',
});

const KeyPairName = stack.addParameter('KeyPairName', {
  Type: 'AWS::EC2::KeyPair::KeyName',
});

const VpcCidrBlocks = stack.addParameter('VpcCidrBlocks', {
  Type: 'CommaDelimitedList',
  Default: '10.0.0.0/16, 10.0.0.0/24, 10.0.1.0/24',
  Description: 'vpc, public subnet, private subnet',
});

const SubnetAZ = stack.addParameter('SubnetAZ', {
  Type: 'AWS::EC2::AvailabilityZone::Name',
  Default: 'us-east-1a',
});

// ==============================================
// VPC
// ==============================================
const Vpc = stack.addResource('Vpc', {
  Type: 'AWS::EC2::VPC',
  Description: 'Section 3 activity VPC',
  Properties: {
    CidrBlock: Fn_Select({
      Options: VpcCidrBlocks.Ref(), // 10.0.0.0/16
      Index: 0,
    }),
    EnableDnsSupport: true,
    EnableDnsHostnames: true,
    Tags: [NameTagSub('${AWS::StackName}-vpc')],
  },
});

// ==============================================
// Subnets
// ==============================================
const PublicSubnet = stack.addResource('PublicSubnet', {
  Type: 'AWS::EC2::Subnet',
  Properties: {
    AvailabilityZone: SubnetAZ.Ref(),
    CidrBlock: Fn_Select({
      Options: VpcCidrBlocks.Ref(), // 10.0.0.0/24
      Index: 1,
    }),
    MapPublicIpOnLaunch: true,
    VpcId: Vpc.Ref(),
    Tags: [NameTag('Public Subnet')],
  },
});
const PrivateSubnet = stack.addResource('PrivateSubnet', {
  Type: 'AWS::EC2::Subnet',
  Properties: {
    AvailabilityZone: SubnetAZ.Ref(),
    CidrBlock: Fn_Select({
      Options: VpcCidrBlocks.Ref(), // 10.0.1.0/24
      Index: 2,
    }),
    VpcId: Vpc.Ref(),
    Tags: [NameTag('Private Subnet')],
  },
});

// ==============================================
// Route tables
// ==============================================
const PublicRouteTable = stack.addResource('PublicRouteTable', {
  Type: 'AWS::EC2::RouteTable',
  Properties: {
    VpcId: Vpc.Ref(),
    Tags: [NameTag('Public Route Table')],
  },
});
const PrivateRouteTable = stack.addResource('PrivateRouteTable', {
  Type: 'AWS::EC2::RouteTable',
  Properties: {
    VpcId: Vpc.Ref(),
    Tags: [NameTag('Private Route Table')],
  },
});

// ==============================================
// Internet route for the public route table
// ==============================================
const InternetGateway = stack.addResource('InternetGateway', {
  Type: 'AWS::EC2::InternetGateway',
});
const VpcGatewayAttachment = stack.addResource('VpcGatewayAttachment', {
  Type: 'AWS::EC2::VPCGatewayAttachment',
  Properties: {
    VpcId: Vpc.Ref(),
    InternetGatewayId: InternetGateway.Ref(),
  },
});
const InternetRoute = stack.addResource('InternetRoute', {
  Type: 'AWS::EC2::Route',
  DependsOn: [VpcGatewayAttachment.Name()],
  Properties: {
    RouteTableId: PublicRouteTable.Ref(),
    GatewayId: InternetGateway.Ref(),
    DestinationCidrBlock: '0.0.0.0/0',
  },
});

// ==============================================
// Subnet - Route table associations
// ==============================================
const PublicSubnetRouteTableAssoc = stack.addResource('PublicSubnetRouteTableAssoc', {
  Type: 'AWS::EC2::SubnetRouteTableAssociation',
  Properties: {
    RouteTableId: PublicRouteTable.Ref(),
    SubnetId: PublicSubnet.Ref(),
  },
});
stack.addResource('PrivateSubnetRouteTableAssoc', {
  Type: 'AWS::EC2::SubnetRouteTableAssociation',
  Properties: {
    RouteTableId: PrivateRouteTable.Ref(),
    SubnetId: PrivateSubnet.Ref(),
  },
});

// ==============================================
// Web server and security group
// ==============================================
const WebServerSecurityGroup = stack.addResource('WebServerSecurityGroup', {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    GroupDescription: 'Activity security group',
    VpcId: Vpc.Ref(),
    SecurityGroupIngress: [
      {
        // HTTP rule
        CidrIp: '0.0.0.0/0',
        IpProtocol: 'tcp',
        FromPort: 80,
        ToPort: 80,
      },
      {
        // SSH rule
        CidrIp: '0.0.0.0/0',
        IpProtocol: 'tcp',
        FromPort: 22,
        ToPort: 22,
      },
    ],
  },
});

stack.addResource('WebServerInstance', {
  Type: 'AWS::EC2::Instance',
  DependsOn: [InternetRoute.Name(), PublicSubnetRouteTableAssoc.Name()],
  Properties: {
    InstanceType: InstanceType.Ref(), // t2.micro
    SubnetId: PublicSubnet.Ref(),
    ImageId: ImageId.Ref(), // ami-0b5eea76982371e91
    KeyName: KeyPairName.Ref(),
    SecurityGroupIds: [WebServerSecurityGroup.Ref()],
    BlockDeviceMappings: [
      {
        DeviceName: '/dev/sdf',
        Ebs: {
          VolumeSize: EbsVolumeSize.Ref(),
          VolumeType: 'gp2',
        },
      },
    ],
    Tags: [NameTag('Web Server')],
  },
});

console.log(stack.json());
