// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html
export const PseudoParameter = {
  AccountId: 'AWS::AccountId',
  NotificationARNs: 'AWS::NotificationARNs',
  NoValue: 'AWS::NoValue',
  Partition: 'AWS::Partition',
  Region: 'AWS::Region',
  StackId: 'AWS::StackId',
  StackName: 'AWS::StackName',
  URLSuffix: 'AWS::URLSuffix',
};

export const isValidPseudoParameter = (paramName: string) => {
  return Object.values(PseudoParameter).includes(paramName);
};
