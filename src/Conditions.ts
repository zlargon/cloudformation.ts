import { Value } from './Value.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/conditions-section-structure.html
export type Condition =
  | { Condition: string }
  | { 'Fn::Equals': [Value, Value] }
  | { 'Fn::And': Condition[] }
  | { 'Fn::Not': [Condition] }
  | { 'Fn::Or': Condition[] };

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html#intrinsic-function-reference-conditions-and
export const Fn_And = (...conditions: Condition[]): Condition => {
  return { 'Fn::And': [...conditions] };
};

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html#intrinsic-function-reference-conditions-equals
export const Fn_Equals = <T>(value1: Value<T>, value2: Value<T>): Condition => {
  return { 'Fn::Equals': [value1, value2] };
};

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html#intrinsic-function-reference-conditions-not
export const Fn_Not = (condition: Condition): Condition => {
  return { 'Fn::Not': [condition] };
};

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html#intrinsic-function-reference-conditions-or
export const Fn_Or = (...conditions: Condition[]): Condition => {
  return { 'Fn::Or': [...conditions] };
};
