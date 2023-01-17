import { Ref } from './Ref.ts';
import { Region } from './Region.ts';

export interface AZsValue {
  'Fn::GetAZs': '' | Region | Ref;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getavailabilityzones.html
export const Fn_GetAZs = (region: '' | Region | Ref) => {
  return { 'Fn::GetAZs': region };
};
