import { Ref } from './Ref.ts';
import { ResourceAttributes } from './ResourceAttributes.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html
export interface EC2_Route extends ResourceAttributes {
  Type: 'AWS::EC2::Route';
  Properties: {
    CarrierGatewayId?: string | Ref;
    DestinationCidrBlock?: string;
    DestinationIpv6CidrBlock?: string;
    EgressOnlyInternetGatewayId?: string | Ref;
    GatewayId?: string | Ref;
    InstanceId?: string | Ref;
    LocalGatewayId?: string | Ref;
    NatGatewayId?: string | Ref;
    NetworkInterfaceId?: string | Ref;
    RouteTableId: string | Ref;
    TransitGatewayId?: string | Ref;
    VpcEndpointId?: string | Ref;
    VpcPeeringConnectionId?: string | Ref;
  };
}
