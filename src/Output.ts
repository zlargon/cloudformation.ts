import { SubValue } from './Fn_Sub.ts';
import { Value } from './Value.ts';

export interface Output {
  Description?: string;
  Value: Value;
  Export?: {
    Name: string | SubValue;
  };
}
