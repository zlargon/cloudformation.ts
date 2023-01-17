import { Fn_Sub, SubValue } from './Fn_Sub.ts';
import { Value } from './Value.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html
export interface Tag {
  Key: string;
  Value: string | SubValue;
}

export const Tag = (Key: string, Value: string | SubValue): Tag => {
  return { Key, Value };
};

export const TagSub = (Key: string, stringTemplate: string, keyValuePair?: Record<string, Value>): Tag => {
  return Tag(Key, Fn_Sub(stringTemplate, keyValuePair));
};

// ========================================================
// Name Tags
// ========================================================
export const NameTag = (Value: string | SubValue): Tag => {
  return { Key: 'Name', Value };
};

export const NameTagSub = (stringTemplate: string, keyValuePair?: Record<string, Value>): Tag => {
  return TagSub('Name', stringTemplate, keyValuePair);
};
