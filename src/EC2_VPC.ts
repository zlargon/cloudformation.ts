import { SelectedValue } from './Fn_Select.ts';
import { Ref } from './Ref.ts';
import { ResourceAttributes } from './ResourceAttributes.ts';
import { Tag } from './Tag.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html
export interface EC2_VPC extends ResourceAttributes {
  Type: 'AWS::EC2::VPC';
  Properties?: {
    CidrBlock?: string | Ref | SelectedValue; // e.g. "10.0.0.0/16"
    EnableDnsHostnames?: boolean;
    EnableDnsSupport?: boolean;
    InstanceTenancy?: 'dedicated' | 'default' | 'host';
    Ipv4IpamPoolId?: string;
    Ipv4NetmaskLength?: number;
    Tags?: Tag[];
  };
}
