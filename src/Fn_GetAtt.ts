export interface AttributeValue {
  'Fn::GetAtt': [string, string];
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html
export const Fn_GetAtt = (logicalName: string, attributeName: string): AttributeValue => {
  return { 'Fn::GetAtt': [logicalName, attributeName] };
};
