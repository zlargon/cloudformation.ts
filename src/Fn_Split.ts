import { Value } from './Value.ts';

export interface SplitValues {
  'Fn::Split': [string, Value];
}

interface Fn_Split_Props {
  Delimiter: string;
  Source: Value;
}

export const Fn_Split = ({ Source, Delimiter }: Fn_Split_Props): SplitValues => {
  return { 'Fn::Split': [Delimiter, Source] };
};
