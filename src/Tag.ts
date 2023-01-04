// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html
export interface Tag {
  Key: string;
  Value: string;
}

export const Tag = (Key: string, Value: string): Tag => {
  return { Key, Value };
};
