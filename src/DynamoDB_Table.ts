import { ResourceAttributes } from './ResourceAttributes.ts';
import { Tag } from './Tag.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html
export interface DynamoDB_Table extends ResourceAttributes {
  Type: 'AWS::DynamoDB::Table';
  Properties: {
    AttributeDefinitions?: AttributeDefinition[];
    BillingMode?: 'PROVISIONED' | 'PAY_PER_REQUEST';
    ContributorInsightsSpecification?: ContributorInsightsSpecification;
    GlobalSecondaryIndexes?: GlobalSecondaryIndex[];
    ImportSourceSpecification?: ImportSourceSpecification;
    KeySchema: KeySchema[];
    KinesisStreamSpecification?: KinesisStreamSpecification;
    LocalSecondaryIndexes?: LocalSecondaryIndex[];
    PointInTimeRecoverySpecification?: PointInTimeRecoverySpecification;
    ProvisionedThroughput?: ProvisionedThroughput;
    SSESpecification?: SSESpecification;
    StreamSpecification?: StreamSpecification;
    TableClass?: string;
    TableName?: string;
    Tags?: Tag[];
    TimeToLiveSpecification?: TimeToLiveSpecification;
  };
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-attributedefinition.html
interface AttributeDefinition {
  AttributeName: string;
  AttributeType: 'S' | 'N' | 'B';
}
export function StringAttribute(AttributeName: string): AttributeDefinition {
  return { AttributeName, AttributeType: 'S' };
}
export function NumberAttribute(AttributeName: string): AttributeDefinition {
  return { AttributeName, AttributeType: 'N' };
}
export function BooleanAttribute(AttributeName: string): AttributeDefinition {
  return { AttributeName, AttributeType: 'B' };
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-contributorinsightsspecification.html
interface ContributorInsightsSpecification {
  Enabled: boolean;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-csv.html
interface Csv {
  Delimiter?: string;
  HeaderList?: string[];
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-globalsecondaryindex.html
interface GlobalSecondaryIndex {
  ContributorInsightsSpecification?: ContributorInsightsSpecification;
  IndexName: string;
  KeySchema: KeySchema[];
  Projection: Projection;
  ProvisionedThroughput?: ProvisionedThroughput;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-importsourcespecification.html
interface ImportSourceSpecification {
  InputCompressionType?: string;
  InputFormat: string;
  InputFormatOptions?: InputFormatOptions;
  S3BucketSource: S3BucketSource;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-inputformatoptions.html
interface InputFormatOptions {
  Csv?: Csv;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-keyschema.html
interface KeySchema {
  AttributeName: string;
  KeyType: 'HASH' | 'RANGE';
}
export function PartitionKey(AttributeName: string): KeySchema {
  if (1 > AttributeName.length || AttributeName.length > 255) throw new Error('string length should between 1 and 255');
  return { AttributeName, KeyType: 'HASH' };
}
export function SortKey(AttributeName: string): KeySchema {
  if (1 > AttributeName.length || AttributeName.length > 255) throw new Error('string length should between 1 and 255');
  return { AttributeName, KeyType: 'RANGE' };
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-kinesisstreamspecification.html
interface KinesisStreamSpecification {
  StreamArn: string;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-localsecondaryindex.html
interface LocalSecondaryIndex {
  IndexName: string;
  KeySchema: KeySchema[];
  Projection: Projection;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-pointintimerecoveryspecification.html
interface PointInTimeRecoverySpecification {
  PointInTimeRecoveryEnabled?: boolean;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-projection.html
interface Projection {
  NonKeyAttributes?: string[];
  ProjectionType?: 'KEYS_ONLY' | 'INCLUDE' | 'ALL';
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-provisionedthroughput.html
interface ProvisionedThroughput {
  ReadCapacityUnits: number;
  WriteCapacityUnits: number;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-s3bucketsource.html
interface S3BucketSource {
  S3Bucket: string;
  S3BucketOwner?: string;
  S3KeyPrefix?: string;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html
interface SSESpecification {
  KMSMasterKeyId?: string;
  SSEEnabled: boolean;
  SSEType?: 'KMS';
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-streamspecification.html
interface StreamSpecification {
  StreamViewType: 'KEYS_ONLY' | 'NEW_IMAGE' | 'OLD_IMAGE' | 'NEW_AND_OLD_IMAGES';
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-timetolivespecification.html
interface TimeToLiveSpecification {
  AttributeName: string;
  Enabled: boolean;
}
