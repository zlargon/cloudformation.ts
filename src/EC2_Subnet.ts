import { SelectedValue } from './Fn_Select.ts';
import { Ref } from './Ref.ts';
import { ResourceAttributes } from './ResourceAttributes.ts';
import { Tag } from './Tag.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet.html
export interface EC2_Subnet extends ResourceAttributes {
  Type: 'AWS::EC2::Subnet';
  Properties: {
    AssignIpv6AddressOnCreation?: boolean;
    AvailabilityZone?: string | Ref;
    AvailabilityZoneId?: string;
    CidrBlock?: string | Ref | SelectedValue;
    EnableDns64?: boolean;
    Ipv6CidrBlock?: string;
    Ipv6Native?: boolean;
    MapPublicIpOnLaunch?: boolean;
    OutpostArn?: string;
    PrivateDnsNameOptionsOnLaunch?: PrivateDnsNameOptionsOnLaunch;
    Tags?: Tag[];
    VpcId: string | Ref;
  };
}

interface PrivateDnsNameOptionsOnLaunch {
  EnableResourceNameDnsAAAARecord?: boolean;
  EnableResourceNameDnsARecord?: boolean;
  HostnameType?: 'ip-name' | 'resource-name';
}
