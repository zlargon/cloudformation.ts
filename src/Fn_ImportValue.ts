import { Fn_Sub, SubValue } from './Fn_Sub.ts';
import { Value } from './Value.ts';

export interface ImportValue {
  'Fn::ImportValue': string | SubValue;
}

export const Fn_ImportValue = (sharedValueToImport: string | SubValue): ImportValue => {
  return { 'Fn::ImportValue': sharedValueToImport };
};

export const Fn_ImportValueSub = (stringTemplate: string, keyValuePair?: Record<string, Value>): ImportValue => {
  return Fn_ImportValue(Fn_Sub(stringTemplate, keyValuePair));
};
