export interface ResourceAttributes {
  // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html#associating-a-condition
  Condition?: string;

  // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-product-attribute-reference.html
  Description?: string;
  CreationPolicy?: unknown;
  DeletionPolicy?: 'Delete' | 'Retain' | 'Snapshot';
  DependsOn?: string | string[];
  Metadata?: Record<string, unknown>;
  UpdatePolicy?: unknown;
  UpdateReplacePolicy?: unknown;
}
