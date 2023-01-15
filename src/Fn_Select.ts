import { Ref } from './Ref.ts';

export interface SelectedValue<T = unknown> {
  'Fn::Select': [number, Ref | T[]];
}

interface Fn_Select_Props<T> {
  Index: number;
  Options: Ref | T[];
}

export const Fn_Select = <T = unknown>({ Index, Options }: Fn_Select_Props<T>): SelectedValue<T> => {
  return { 'Fn::Select': [Index, Options] };
};
