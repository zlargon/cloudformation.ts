import { Ref } from './Ref.ts';
import { ResourceAttributes } from './ResourceAttributes.ts';
import { Tag } from './Tag.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-routetable.html
export interface EC2_RouteTable extends ResourceAttributes {
  Type: 'AWS::EC2::RouteTable';
  Properties: {
    Tags?: Tag[];
    VpcId: string | Ref;
  };
}
