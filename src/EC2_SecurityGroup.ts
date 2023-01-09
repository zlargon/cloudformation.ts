import { SelectedValue } from './Fn_Select.ts';
import { Ref } from './Ref.ts';
import { ResourceAttributes } from './ResourceAttributes.ts';
import { Tag } from './Tag.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-security-group.html
export interface EC2_SecurityGroup extends ResourceAttributes {
  Type: 'AWS::EC2::SecurityGroup';
  Properties: {
    GroupDescription: string;
    GroupName?: string;
    SecurityGroupEgress?: Egress[];
    SecurityGroupIngress?: Ingress[];
    Tags?: Tag[];
    VpcId?: string | Ref;
  };
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-security-group-rule.html
interface Egress {
  CidrIp?: string;
  CidrIpv6?: string;
  Description?: string;
  DestinationPrefixListId?: string;
  DestinationSecurityGroupId?: string;
  FromPort?: number;
  IpProtocol: IpProtocol;
  ToPort?: number;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-security-group-rule-1.html
interface Ingress {
  CidrIp?: string;
  CidrIpv6?: string;
  Description?: string;
  FromPort?: number | SelectedValue;
  IpProtocol: IpProtocol;
  SourcePrefixListId?: string;
  SourceSecurityGroupId?: string;
  SourceSecurityGroupName?: string;
  SourceSecurityGroupOwnerId?: string;
  ToPort?: number | SelectedValue;
}

// https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml
type IpProtocol = 'tcp' | 'udp' | 'icmp' | 'icmpv6' | number;
