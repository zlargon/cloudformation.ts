// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html
type Number = 'Number';
type String = 'String';
type CommaDelimitedList = 'CommaDelimitedList';
type List<T extends string> = `List<${T}>`;

// AWS-specific parameter types
type SpecificParameter =
  | 'AWS::EC2::AvailabilityZone::Name'
  | 'AWS::EC2::Image::Id'
  | 'AWS::EC2::Instance::Id'
  | 'AWS::EC2::KeyPair::KeyName'
  | 'AWS::EC2::SecurityGroup::GroupName'
  | 'AWS::EC2::SecurityGroup::Id'
  | 'AWS::EC2::Subnet::Id'
  | 'AWS::EC2::Volume::Id'
  | 'AWS::EC2::VPC::Id'
  | 'AWS::Route53::HostedZone::Id';

// SSM parameter types
type SsmParameter =
  | 'AWS::SSM::Parameter::Name' //
  | `AWS::SSM::Parameter::Value<${
      | String
      | List<String>
      | CommaDelimitedList
      | SpecificParameter
      | List<SpecificParameter>}>`;

export interface Parameter {
  Type:
    | String
    | Number
    | List<Number>
    | CommaDelimitedList
    | SpecificParameter
    | List<SpecificParameter>
    | SsmParameter;

  AllowedPattern?: string;
  AllowedValues?: string[];
  ConstraintDescription?: string;
  Default?: string;
  Description?: string;
  MaxLength?: number;
  MaxValue?: number;
  MinLength?: number;
  MinValue?: number;
  NoEcho?: boolean;
}
