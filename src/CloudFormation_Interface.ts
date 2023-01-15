// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-interface.html
export interface CloudFormation_Interface {
  ParameterGroups?: ParameterGroup[];
  ParameterLabels?: Record<string, Label>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-interface-label.html
interface Label {
  default?: string;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-interface-parametergroup.html
interface ParameterGroup {
  Label?: Label;
  Parameters?: string[];
}
