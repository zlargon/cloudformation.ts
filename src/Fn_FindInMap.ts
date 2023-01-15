import { SelectedValue } from './Fn_Select.ts';
import { Ref } from './Ref.ts';

// deno-lint-ignore no-explicit-any
export interface MappingValue<M extends Record<string, any> = any> {
  'Fn::FindInMap': [
    string, // MapName
    keyof M | Ref | SelectedValue, // TopLevelKey
    keyof M[keyof M] | Ref | SelectedValue // SecondLevelKey
  ];
}

interface Fn_FindInMap_Props<M> {
  MapName: string;
  TopLevelKey: keyof M | Ref | SelectedValue;
  SecondLevelKey: keyof M[keyof M] | Ref | SelectedValue;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-findinmap-enhancements.html
// deno-lint-ignore no-explicit-any
export const Fn_FindInMap = <M extends Record<string, any> = any>({
  MapName,
  TopLevelKey,
  SecondLevelKey,
}: Fn_FindInMap_Props<M>): MappingValue<M> => {
  return { 'Fn::FindInMap': [MapName, TopLevelKey, SecondLevelKey] };
};
