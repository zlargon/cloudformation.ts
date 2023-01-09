import { Ref } from './Ref.ts';

export interface SelectedValue<T = unknown> {
  'Fn::Select': [number, Ref | T[]];
}

export const Fn_Select = <T = unknown>(index: number, listOfObjects: Ref | T[]): SelectedValue<T> => {
  return { 'Fn::Select': [index, listOfObjects] };
};
