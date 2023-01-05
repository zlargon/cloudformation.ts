import { ResourceAttributes } from './ResourceAttributes.ts';
import { Tag } from './Tag.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-internetgateway.html
export interface EC2_InternetGateway extends ResourceAttributes {
  Type: 'AWS::EC2::InternetGateway';
  Properties?: {
    Tags?: Tag[];
  };
}
