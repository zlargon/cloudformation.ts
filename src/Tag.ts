import { SubValue } from './Fn_Sub.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html
export interface Tag {
  Key: string;
  Value: string | SubValue;
}

export const Tag = (Key: string, Value: string | SubValue): Tag => {
  return { Key, Value };
};

export const NameTag = (Value: string | SubValue): Tag => {
  return Tag('Name', Value);
};
