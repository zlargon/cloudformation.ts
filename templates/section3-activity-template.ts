#!/usr/bin/env -S deno run
import { Stack } from '../src/Stack.ts';
import { Tag } from '../src/Tag.ts';
import { Ref } from '../src/Ref.ts';
import { Fn_Select } from '../src/Fn_Select.ts';
import { Fn_Sub } from '../src/Fn_Sub.ts';

const stack = Stack();
stack.setDescription(`Section 3 Activity template.
It launches a VPC with public and private subnets,
a web server EC2 instance in the public subnet
and a security group attached to this EC2 instance.`);

const Constant = {
  // Parameters
  InstanceType: 'InstanceType',
  ImageId: 'ImageId',
  EbsVolumeSize: 'EbsVolumeSize',
  KeyPairName: 'KeyPairName',
  VpcCidrBlocks: 'VpcCidrBlocks',
  SubnetAZ: 'SubnetAZ',

  // Resources
  Vpc: 'Vpc',
  PublicSubnet: 'PublicSubnet',
  PrivateSubnet: 'PrivateSubnet',
  PublicRouteTable: 'PublicRouteTable',
  PrivateRouteTable: 'PrivateRouteTable',
  InternetGateway: 'InternetGateway',
  VpcGatewayAttachment: 'VpcGatewayAttachment',
  InternetRoute: 'InternetRoute',
  PublicSubnetRouteTableAssoc: 'PublicSubnetRouteTableAssoc',
  PrivateSubnetRouteTableAssoc: 'PrivateSubnetRouteTableAssoc',
  WebServerInstance: 'WebServerInstance',
  WebServerSecurityGroup: 'WebServerSecurityGroup',
};

// ==============================================
// Parameters
// ==============================================
stack.addParameter(Constant.InstanceType, {
  Type: 'String',
  Default: 't2.micro',
  AllowedValues: [
    't2.nano', //
    't2.micro',
    't2.small',
  ],
});

stack.addParameter(Constant.ImageId, {
  Type: 'AWS::EC2::Image::Id',
  Default: 'ami-0b5eea76982371e91',
});

stack.addParameter(Constant.EbsVolumeSize, {
  Type: 'Number',
  Default: 20,
  Description: 'Volume size in GiB',
});

stack.addParameter(Constant.KeyPairName, {
  Type: 'AWS::EC2::KeyPair::KeyName',
});

stack.addParameter(Constant.VpcCidrBlocks, {
  Type: 'CommaDelimitedList',
  Default: '10.0.0.0/16, 10.0.0.0/24, 10.0.1.0/24',
  Description: 'vpc, public subnet, private subnet',
});

stack.addParameter(Constant.SubnetAZ, {
  Type: 'AWS::EC2::AvailabilityZone::Name',
  Default: 'us-east-1a',
});

// ==============================================
// VPC
// ==============================================
stack.addResource(Constant.Vpc, {
  Type: 'AWS::EC2::VPC',
  Description: 'Section 3 activity VPC',
  Properties: {
    CidrBlock: Fn_Select(0, Ref(Constant.VpcCidrBlocks)), // 10.0.0.0/16
    EnableDnsSupport: true,
    EnableDnsHostnames: true,
    Tags: [
      Tag('Name', Fn_Sub('${AWS::StackName}-vpc')), //
    ],
  },
});

// ==============================================
// Subnets
// ==============================================
stack.addResource(Constant.PublicSubnet, {
  Type: 'AWS::EC2::Subnet',
  Properties: {
    AvailabilityZone: Ref(Constant.SubnetAZ),
    CidrBlock: Fn_Select(1, Ref(Constant.VpcCidrBlocks)), // 10.0.0.0/24
    MapPublicIpOnLaunch: true,
    VpcId: Ref(Constant.Vpc),
    Tags: [
      Tag('Name', 'Public Subnet'), //
    ],
  },
});
stack.addResource(Constant.PrivateSubnet, {
  Type: 'AWS::EC2::Subnet',
  Properties: {
    AvailabilityZone: Ref(Constant.SubnetAZ),
    CidrBlock: Fn_Select(2, Ref(Constant.VpcCidrBlocks)), // 10.0.1.0/24
    VpcId: Ref(Constant.Vpc),
    Tags: [
      Tag('Name', 'Private Subnet'), //
    ],
  },
});

// ==============================================
// Route tables
// ==============================================
stack.addResource(Constant.PublicRouteTable, {
  Type: 'AWS::EC2::RouteTable',
  Properties: {
    VpcId: Ref(Constant.Vpc),
    Tags: [
      Tag('Name', 'Public Route Table'), //
    ],
  },
});
stack.addResource(Constant.PrivateRouteTable, {
  Type: 'AWS::EC2::RouteTable',
  Properties: {
    VpcId: Ref(Constant.Vpc),
    Tags: [
      Tag('Name', 'Private Route Table'), //
    ],
  },
});

// ==============================================
// Internet route for the public route table
// ==============================================
stack.addResource(Constant.InternetGateway, {
  Type: 'AWS::EC2::InternetGateway',
});
stack.addResource(Constant.VpcGatewayAttachment, {
  Type: 'AWS::EC2::VPCGatewayAttachment',
  Properties: {
    VpcId: Ref(Constant.Vpc),
    InternetGatewayId: Ref(Constant.InternetGateway),
  },
});
stack.addResource(Constant.InternetRoute, {
  Type: 'AWS::EC2::Route',
  DependsOn: [Constant.VpcGatewayAttachment],
  Properties: {
    RouteTableId: Ref(Constant.PublicRouteTable),
    GatewayId: Ref(Constant.InternetGateway),
    DestinationCidrBlock: '0.0.0.0/0',
  },
});

// ==============================================
// Subnet - Route table associations
// ==============================================
stack.addResource(Constant.PublicSubnetRouteTableAssoc, {
  Type: 'AWS::EC2::SubnetRouteTableAssociation',
  Properties: {
    RouteTableId: Ref(Constant.PublicRouteTable),
    SubnetId: Ref(Constant.PublicSubnet),
  },
});
stack.addResource(Constant.PrivateSubnetRouteTableAssoc, {
  Type: 'AWS::EC2::SubnetRouteTableAssociation',
  Properties: {
    RouteTableId: Ref(Constant.PrivateRouteTable),
    SubnetId: Ref(Constant.PrivateSubnet),
  },
});

// ==============================================
// Web server and security group
// ==============================================
stack.addResource(Constant.WebServerInstance, {
  Type: 'AWS::EC2::Instance',
  DependsOn: [Constant.InternetRoute, Constant.PublicSubnetRouteTableAssoc],
  Properties: {
    InstanceType: Ref(Constant.InstanceType), // t2.micro
    SubnetId: Ref(Constant.PublicSubnet),
    ImageId: Ref(Constant.ImageId), // ami-0b5eea76982371e91
    KeyName: Ref(Constant.KeyPairName),
    SecurityGroupIds: [Ref(Constant.WebServerSecurityGroup)],
    BlockDeviceMappings: [
      {
        DeviceName: '/dev/sdf',
        Ebs: {
          VolumeSize: Ref(Constant.EbsVolumeSize),
          VolumeType: 'gp2',
        },
      },
    ],
    Tags: [
      Tag('Name', 'Web Server'), //
    ],
  },
});

stack.addResource(Constant.WebServerSecurityGroup, {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    GroupDescription: 'Activity security group',
    VpcId: Ref(Constant.Vpc),
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

console.log(stack.json());
