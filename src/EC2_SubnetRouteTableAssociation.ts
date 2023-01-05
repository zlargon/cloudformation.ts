import { Ref } from './Ref.ts';
import { ResourceAttributes } from './ResourceAttributes.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnetroutetableassociation.html
export interface EC2_SubnetRouteTableAssociation extends ResourceAttributes {
  Type: 'AWS::EC2::SubnetRouteTableAssociation';
  Properties: {
    RouteTableId: string | Ref;
    SubnetId: string | Ref;
  };
}
