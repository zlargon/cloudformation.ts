import { MappingValue } from './Fn_FindInMap.ts';
import { SelectedValue } from './Fn_Select.ts';
import { Ref } from './Ref.ts';

export type Value<T = string> = T | Ref | SelectedValue | MappingValue;
