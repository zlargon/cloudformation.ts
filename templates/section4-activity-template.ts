#!/usr/bin/env -S deno run
import { Stack } from '../src/Stack.ts';
import { NameTag } from '../src/Tag.ts';
import { Fn_Select } from '../src/Fn_Select.ts';
import { Fn_Format } from '../src/Fn_Format.ts';
import { PseudoParameter } from '../src/PseudoParameter.ts';
import { Ref } from '../src/Ref.ts';

const stack = Stack();
stack.setDescription(`

Section 4 Activity template.
It launches a VPC with public and private subnets,
a web server EC2 instance in the public subnet
and a security group attached to this EC2 instance.

`);

// ==============================================
// Parameters
// ==============================================
const InstanceType = stack.addParameter('InstanceType', {
  Type: 'String',
  AllowedValues: [
    't2.nano', //
    't2.micro',
    't2.small',
  ],
  Default: 't2.micro',
});

const EbsVolumeSize = stack.addParameter('EbsVolumeSize', {
  Type: 'Number',
  Description: 'Volume size in GiB',
  Default: 10,
});

const KeyPairName = stack.addParameter('KeyPairName', {
  Type: 'AWS::EC2::KeyPair::KeyName',
});

const VpcCidrBlocks = stack.addParameter('VpcCidrBlocks', {
  Type: 'CommaDelimitedList',
  Description: 'vpc, public subnet, private subnet',
  Default: '10.0.0.0/16, 10.0.1.0/24, 10.0.2.0/24',
});

const SubnetAZ = stack.addParameter('SubnetAZ', {
  Type: 'AWS::EC2::AvailabilityZone::Name',
});

// ==============================================
// Mappings
// ==============================================
const Fn_FindInRegionImageMap = stack.addMapping('RegionImages', {
  'eu-west-1': { ImageId: 'ami-0fe0b2cf0e1f25c8a' },
  'us-east-1': { ImageId: 'ami-0b5eea76982371e91' },
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
    Tags: [
      NameTag(
        Fn_Format('{{stackName}}-vpc', {
          stackName: PseudoParameter.StackName,
        })
      ),
    ],
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
    ImageId: Fn_FindInRegionImageMap(Ref(PseudoParameter.Region), 'ImageId'), // ami-0b5eea76982371e91
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

// ==============================================
// Metadata
// ==============================================
stack.metadata.addParameterGroup('Web Server Settings', [
  InstanceType.Name(), //
  EbsVolumeSize.Name(),
  KeyPairName.Name(),
]);
stack.metadata.addParameterGroup('VPC Settings', [
  VpcCidrBlocks.Name(), //
  SubnetAZ.Name(),
]);
stack.metadata.addParameterLabel(SubnetAZ.Name(), 'Select an Availability Zone for the subnets');
stack.metadata.addParameterLabel(KeyPairName.Name(), 'Select an EC2 key pair');

console.log(stack.json());
