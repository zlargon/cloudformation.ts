import { Ref } from './Ref.ts';
import { ResourceAttributes } from './ResourceAttributes.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc-gateway-attachment.html
export interface EC2_VPCGatewayAttachment extends ResourceAttributes {
  Type: 'AWS::EC2::VPCGatewayAttachment';
  Properties: {
    InternetGatewayId?: string | Ref;
    VpcId: string | Ref;
    VpnGatewayId?: string | Ref;
  };
}
