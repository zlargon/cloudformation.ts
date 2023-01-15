import { Value } from './Value.ts';

// "Fn::If" is the only intrinsic function can be used outside the condition section in a template

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html#intrinsic-function-reference-conditions-if
interface Fn_If_Condition<T> {
  Then: Value<T>;
  Else: Value<T>;
}

export type IfConditionOutput<T> = { 'Fn::If': [string, Value<T>, Value<T>] };

export const Fn_If = <T>(conditionName: string, { Then, Else }: Fn_If_Condition<T>): IfConditionOutput<T> => {
  return { 'Fn::If': [conditionName, Then, Else] };
};
