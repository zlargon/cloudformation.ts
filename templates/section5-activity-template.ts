#!/usr/bin/env -S deno run
import { Fn_Equals } from '../src/Conditions.ts';
import { Fn_Sub } from '../src/Fn_Sub.ts';
import { PseudoParameter } from '../src/PseudoParameter.ts';
import { Ref } from '../src/Ref.ts';
import { Stack } from '../src/Stack.ts';
import { NameTag } from '../src/Tag.ts';

const stack = Stack();
stack.setDescription(`
Section 5 Activity template.
It launches a web server EC2 instance with separate security groups for HTTP and SSH access.
It creates an EBS volume and attaches it to the EC2 instance.`);

// ==============================================
// Parameters
// ==============================================
const VpcId = stack.addParameter('VpcId', {
  Type: 'AWS::EC2::VPC::Id',
});

const WebServerSubnet = stack.addParameter('WebServerSubnet', {
  Type: 'AWS::EC2::Subnet::Id',
  Description: 'It should be in the same VPC.',
});

const EbsVolumeSize = stack.addParameter('EbsVolumeSize', {
  Type: 'Number',
  Description: 'Size in GiB',
  Default: 10,
});

const KeyPairName = stack.addParameter('KeyPairName', {
  Type: 'AWS::EC2::KeyPair::KeyName',
});

const NewVolumeOption = stack.addParameter('NewVolumeOption', {
  Type: 'String',
  AllowedValues: [
    true, //
    false,
  ],
  Description: 'Whether to create and attach an EBS volume',
});

// ==============================================
// Conditions
// ==============================================
const NewVolumeOptionSelected = stack.addCondition('NewVolumeOptionSelected', Fn_Equals(NewVolumeOption.Ref(), true));

// ==============================================
// Mappings
// ==============================================
const Fn_FindInRegionImageMap = stack.addMapping('RegionImages', {
  'eu-west-1': { ImageId: 'ami-0fe0b2cf0e1f25c8a' },
  'us-east-1': { ImageId: 'ami-0b5eea76982371e91' },
});

// ==============================================
// Resources
// ==============================================

// Security groups allowing access to different ports
const HttpSecurityGroup = stack.addResource('HttpSecurityGroup', {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    GroupDescription: 'Security group for HTTP access',
    VpcId: VpcId.Ref(),
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0',
        IpProtocol: 'tcp',
        FromPort: 80,
        ToPort: 80,
      },
    ],
  },
});

const SshSecurityGroup = stack.addResource('SshSecurityGroup', {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    GroupDescription: 'Security group to allow SSH access',
    VpcId: VpcId.Ref(),
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0',
        IpProtocol: 'tcp',
        FromPort: 22,
        ToPort: 22,
      },
    ],
  },
});

const WebServerInstance = stack.addResource('WebServerInstance', {
  Type: 'AWS::EC2::Instance',
  Properties: {
    InstanceType: 't2.micro',
    SubnetId: WebServerSubnet.Ref(),
    ImageId: Fn_FindInRegionImageMap(Ref(PseudoParameter.Region), 'ImageId'),
    KeyName: KeyPairName.Ref(),
    SecurityGroupIds: [HttpSecurityGroup.Ref(), SshSecurityGroup.Ref()],
    Tags: [NameTag(Fn_Sub('${AWS::StackName}-WebServer'))],
  },
});

// EBS Volume that should be created in the same AZ with the WebServerInstance
const EbsVolume = stack.addResource('EbsVolume', {
  Type: 'AWS::EC2::Volume',
  Condition: NewVolumeOptionSelected.Condition(),
  Properties: {
    AvailabilityZone: WebServerInstance.Attr('AvailabilityZone'),
    VolumeType: 'gp2',
    Size: EbsVolumeSize.Ref(),
    Tags: [NameTag(Fn_Sub('${AWS::StackName}-Volume'))],
  },
});

stack.addResource('VolumeAttachment', {
  Type: 'AWS::EC2::VolumeAttachment',
  Condition: NewVolumeOptionSelected.Condition(),
  Properties: {
    Device: '/dev/sdf',
    InstanceId: WebServerInstance.Ref(),
    VolumeId: EbsVolume.Ref(),
  },
});

// ==============================================
// Metadata
// ==============================================
stack.metadata.addParameterGroup('VPC Settings', [
  VpcId.Name(), //
  WebServerSubnet.Name(),
]);
stack.metadata.addParameterGroup('Web Server Settings', [
  KeyPairName.Name(), //
]);
stack.metadata.addParameterGroup('EBS Volume Settings', [
  EbsVolumeSize.Name(), //
]);
stack.metadata.addParameterLabel(VpcId.Name(), 'Select a VPC');
stack.metadata.addParameterLabel(WebServerSubnet.Name(), 'Select a subnet for the web server');
stack.metadata.addParameterLabel(KeyPairName.Name(), 'Select an EC2 key pair');

// ==============================================
// Outputs
// ==============================================
stack.addOutput('WebServerInstanceId', {
  Value: WebServerInstance.Ref(),
});
stack.addOutput('WebServerPublicDns', {
  Value: WebServerInstance.Attr('PublicDnsName'),
  Description: 'The public DNS name of the web server',
});
stack.addOutput('EbsVolumeId', {
  Value: EbsVolume.Ref(),
  Condition: NewVolumeOptionSelected.Condition(),
});

console.log(stack.json());
