import { ResourceAttributes } from './ResourceAttributes.ts';
import { Tag } from './Tag.ts';
import { Value } from './Value.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet.html
export interface EC2_Subnet extends ResourceAttributes {
  Type: 'AWS::EC2::Subnet';
  Properties: {
    AssignIpv6AddressOnCreation?: Value<boolean>;
    AvailabilityZone?: Value<string>;
    AvailabilityZoneId?: Value<string>;
    CidrBlock?: Value<string>;
    EnableDns64?: Value<boolean>;
    Ipv6CidrBlock?: Value<string>;
    Ipv6Native?: Value<boolean>;
    MapPublicIpOnLaunch?: Value<boolean>;
    OutpostArn?: Value<string>;
    PrivateDnsNameOptionsOnLaunch?: Value<PrivateDnsNameOptionsOnLaunch>;
    Tags?: Tag[];
    VpcId: Value<string>;
  };
}

interface PrivateDnsNameOptionsOnLaunch {
  EnableResourceNameDnsAAAARecord?: boolean;
  EnableResourceNameDnsARecord?: boolean;
  HostnameType?: 'ip-name' | 'resource-name';
}
