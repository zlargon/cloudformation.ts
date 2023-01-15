import { ResourceAttributes } from './ResourceAttributes.ts';
import { Tag } from './Tag.ts';
import { Value } from './Value.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-volume.html
export interface EC2_Volume extends ResourceAttributes {
  Type: 'AWS::EC2::Volume';
  Properties: {
    AutoEnableIO?: Value<boolean>;
    AvailabilityZone: Value<string>;
    Encrypted?: Value<boolean>;
    Iops?: Value<number>;
    KmsKeyId?: Value<string>;
    MultiAttachEnabled?: Value<boolean>;
    OutpostArn?: Value<string>;
    Size?: Value<number>;
    SnapshotId?: Value<string>;
    Tags?: Tag[];
    Throughput?: Value<number>;
    VolumeType?: Value<string>;
  };
}
