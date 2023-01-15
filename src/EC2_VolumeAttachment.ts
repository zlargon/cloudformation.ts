import { ResourceAttributes } from './ResourceAttributes.ts';
import { Value } from './Value.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-ebs-volumeattachment.html
export interface EC2_VolumeAttachment extends ResourceAttributes {
  Type: 'AWS::EC2::VolumeAttachment';
  Properties: {
    Device: Value<string>;
    InstanceId: Value<string>;
    VolumeId: Value<string>;
  };
}
