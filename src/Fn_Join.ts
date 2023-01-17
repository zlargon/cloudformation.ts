import { Value } from './Value.ts';

export interface JoinValue {
  'Fn::Join': [string, Value[]];
}

interface Fn_Join_Props {
  Values: Value[];
  Delimiter: string;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-join.html
export const Fn_Join = ({ Values, Delimiter }: Fn_Join_Props): JoinValue => {
  return { 'Fn::Join': [Delimiter, Values] };
};
