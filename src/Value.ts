import { MappingValue } from './Fn_FindInMap.ts';
import { IfConditionOutput } from './Fn_If.ts';
import { SelectedValue } from './Fn_Select.ts';
import { Ref } from './Ref.ts';

// deno-lint-ignore no-explicit-any
export type Value<T = any> = T | Ref | SelectedValue | MappingValue | IfConditionOutput<T>;
