import { SubValue } from './Fn_Sub.ts';
import { Value } from './Value.ts';

export interface Output {
  // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html#associating-a-condition
  Condition?: string;

  // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html
  Description?: string;
  Value: Value;
  Export?: {
    Name: string | SubValue;
  };
}
