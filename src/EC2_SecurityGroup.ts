import { ResourceAttributes } from './ResourceAttributes.ts';
import { Tag } from './Tag.ts';
import { Value } from './Value.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-security-group.html
export interface EC2_SecurityGroup extends ResourceAttributes {
  Type: 'AWS::EC2::SecurityGroup';
  Properties: {
    GroupDescription: Value<string>;
    GroupName?: Value<string>;
    SecurityGroupEgress?: Value<Egress[]>;
    SecurityGroupIngress?: Value<Ingress[]>;
    Tags?: Tag[];
    VpcId?: Value<string>;
  };
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-security-group-rule.html
interface Egress {
  CidrIp?: Value<string>;
  CidrIpv6?: Value<string>;
  Description?: Value<string>;
  DestinationPrefixListId?: Value<string>;
  DestinationSecurityGroupId?: Value<string>;
  FromPort?: Value<number>;
  IpProtocol: IpProtocol;
  ToPort?: Value<number>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-security-group-rule-1.html
interface Ingress {
  CidrIp?: Value<string>;
  CidrIpv6?: Value<string>;
  Description?: Value<string>;
  FromPort?: Value<number>;
  IpProtocol: Value<IpProtocol>;
  SourcePrefixListId?: Value<string>;
  SourceSecurityGroupId?: Value<string>;
  SourceSecurityGroupName?: Value<string>;
  SourceSecurityGroupOwnerId?: Value<string>;
  ToPort?: Value<number>;
}

// https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml
type IpProtocol = 'tcp' | 'udp' | 'icmp' | 'icmpv6' | number;
