import { Ref } from './Ref.ts';

export const PseudoParameterSet = new Set<string>();

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html
export const PseudoParameter = {
  AccountId: createPseudoParameter('AWS::AccountId'),
  NotificationARNs: createPseudoParameter('AWS::NotificationARNs'),
  NoValue: createPseudoParameter('AWS::NoValue'),
  Partition: createPseudoParameter('AWS::Partition'),
  Region: createPseudoParameter('AWS::Region'),
  StackId: createPseudoParameter('AWS::StackId'),
  StackName: createPseudoParameter('AWS::StackName'),
  URLSuffix: createPseudoParameter('AWS::URLSuffix'),
};

function createPseudoParameter(paramName: string) {
  PseudoParameterSet.add(paramName);

  return {
    Name: () => paramName,
    Ref: () => Ref(paramName),
  };
}
