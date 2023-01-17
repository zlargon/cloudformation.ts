import { MappingValue } from './Fn_FindInMap.ts';
import { AttributeValue } from './Fn_GetAtt.ts';
import { AZsValue } from './Fn_GetAZs.ts';
import { IfConditionResultValue } from './Fn_If.ts';
import { ImportValue } from './Fn_ImportValue.ts';
import { JoinValue } from './Fn_Join.ts';
import { SelectedValue } from './Fn_Select.ts';
import { SplitValues } from './Fn_Split.ts';
import { SubValue } from './Fn_Sub.ts';
import { Ref } from './Ref.ts';

export type Value<T> =
  | T
  | IfConditionResultValue<T>
  | Ref
  | SelectedValue
  | MappingValue
  | AttributeValue
  | AZsValue
  | ImportValue
  | SubValue
  | SplitValues
  | JoinValue;
