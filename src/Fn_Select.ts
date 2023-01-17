import { Value } from './Value.ts';

export interface SelectedValue {
  'Fn::Select': [number, Value | Value[]];
}

interface Fn_Select_Props {
  Index: number;
  Options: Value | Value[];
}

export const Fn_Select = ({ Index, Options }: Fn_Select_Props): SelectedValue => {
  return { 'Fn::Select': [Index, Options] };
};
