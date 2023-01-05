// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-product-attribute-reference.html
export interface ResourceAttributes {
  Description?: string;
  CreationPolicy?: unknown;
  DeletionPolicy?: 'Delete' | 'Retain' | 'Snapshot';
  DependsOn?: string | string[];
  Metadata?: Record<string, unknown>;
  UpdatePolicy?: unknown;
  UpdateReplacePolicy?: unknown;
}
