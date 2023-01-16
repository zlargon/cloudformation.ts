import { ResourceAttributes } from './ResourceAttributes.ts';
import { Tag } from './Tag.ts';
import { Value } from './Value.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-volume.html
export interface S3_Bucket extends ResourceAttributes {
  Type: 'AWS::S3::Bucket';
  Properties?: {
    AccelerateConfiguration?: Value<AccelerateConfiguration>;
    AccessControl?: Value<string>;
    AnalyticsConfigurations?: Value<AnalyticsConfiguration[]>;
    BucketEncryption?: Value<BucketEncryption>;
    BucketName?: Value<string>;
    CorsConfiguration?: Value<CorsConfiguration>;
    IntelligentTieringConfigurations?: Value<IntelligentTieringConfiguration[]>;
    InventoryConfigurations?: Value<InventoryConfiguration[]>;
    LifecycleConfiguration?: Value<LifecycleConfiguration>;
    LoggingConfiguration?: Value<LoggingConfiguration>;
    MetricsConfigurations?: Value<MetricsConfiguration[]>;
    NotificationConfiguration?: Value<NotificationConfiguration>;
    ObjectLockConfiguration?: Value<ObjectLockConfiguration>;
    ObjectLockEnabled?: Value<Value<boolean>>;
    OwnershipControls?: Value<OwnershipControls>;
    PublicAccessBlockConfiguration?: Value<PublicAccessBlockConfiguration>;
    ReplicationConfiguration?: Value<ReplicationConfiguration>;
    Tags?: Tag[];
    VersioningConfiguration?: Value<VersioningConfiguration>;
    WebsiteConfiguration?: Value<WebsiteConfiguration>;
  };
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-abortincompletemultipartupload.html
interface AbortIncompleteMultipartUpload {
  DaysAfterInitiation: number;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accelerateconfiguration.html
interface AccelerateConfiguration {
  AccelerationStatus: Value<'Enabled' | 'Suspended'>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accesscontroltranslation.html
interface AccessControlTranslation {
  Owner: 'Destination';
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html
interface AnalyticsConfiguration {
  Id: Value<string>;
  Prefix?: Value<string>;
  StorageClassAnalysis: Value<StorageClassAnalysis>;
  TagFilters?: Value<TagFilter[]>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-bucketencryption.html
interface BucketEncryption {
  ServerSideEncryptionConfiguration: Value<ServerSideEncryptionRule[]>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors.html
interface CorsConfiguration {
  CorsRules: CorsRule[];
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors-corsrule.html
interface CorsRule {
  AllowedHeaders?: Value<string[]>;
  AllowedMethods: Value<string[]>;
  AllowedOrigins: Value<string[]>;
  ExposedHeaders?: Value<string[]>;
  Id?: Value<string>;
  MaxAge?: Value<number>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html
interface DataExport {
  Destination: Value<Destination>;
  OutputSchemaVersion: 'V_1';
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html
interface DefaultRetention {
  Days: Value<number>;
  Mode: Value<'COMPLIANCE' | 'GOVERNANCE'>;
  Years: Value<number>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-deletemarkerreplication.html
interface DeleteMarkerReplication {
  Status?: Value<'Disabled' | 'Enabled'>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html
interface Destination {
  BucketAccountId?: Value<string>;
  BucketArn: Value<string>;
  Format: Value<string>;
  Prefix?: Value<string>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-encryptionconfiguration.html
interface EncryptionConfiguration {
  ReplicaKmsKeyID: Value<string>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-eventbridgeconfig.html
interface EventBridgeConfiguration {
  EventBridgeEnabled?: Value<boolean>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key-rules.html
interface FilterRule {
  Name: Value<'prefix' | 'suffix'>;
  Value: Value<string>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html
interface IntelligentTieringConfiguration {
  Id: Value<string>;
  Prefix?: Value<string>;
  Status: Value<'Disabled' | 'Enabled'>;
  TagFilters?: TagFilter[];
  Tierings: Tiering[];
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html
interface InventoryConfiguration {
  Destination: Value<Destination>;
  Enabled: Value<boolean>;
  Id: Value<string>;
  IncludedObjectVersions: Value<'All' | 'Current'>;
  OptionalFields?: Value<InventoryConfiguration_OptionalField[]>;
  Prefix?: Value<string>;
  ScheduleFrequency: Value<'Daily' | 'Weekly'>;
}
type InventoryConfiguration_OptionalField =
  | 'Size'
  | 'LastModifiedDate'
  | 'StorageClass'
  | 'ETag'
  | 'IsMultipartUploaded'
  | 'ReplicationStatus'
  | 'EncryptionStatus'
  | 'ObjectLockRetainUntilDate'
  | 'ObjectLockMode'
  | 'ObjectLockLegalHoldStatus'
  | 'IntelligentTieringAccessTier'
  | 'BucketKeyStatus';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-lambdaconfig.html
interface LambdaConfiguration {
  Event: Value<string>;
  Filter?: Value<NotificationFilter>;
  Function: Value<string>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig.html
interface LifecycleConfiguration {
  Rules: Value<Rule[]>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-loggingconfig.html
interface LoggingConfiguration {
  DestinationBucketName: Value<string>;
  LogFilePrefix: Value<string>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metrics.html
interface Metrics {
  EventThreshold?: Value<ReplicationTimeValue>;
  Status: Value<'Disabled' | 'Enabled'>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html
interface MetricsConfiguration {
  AccessPointArn?: Value<string>;
  Id: Value<string>;
  Prefix?: Value<string>;
  TagFilters?: Value<TagFilter[]>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversionexpiration.html
interface NoncurrentVersionExpiration {
  NewerNoncurrentVersions?: Value<number>;
  NoncurrentDays: Value<number>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition.html
interface NoncurrentVersionTransition {
  NewerNoncurrentVersions?: Value<number>;
  StorageClass: Value<'DEEP_ARCHIVE' | 'GLACIER' | 'GLACIER_IR' | 'INTELLIGENT_TIERING' | 'ONEZONE_IA' | 'STANDARD_IA'>;
  TransitionInDays: Value<number>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html
interface NotificationConfiguration {
  EventBridgeConfiguration: Value<EventBridgeConfiguration>;
  LambdaConfigurations: Value<LambdaConfiguration[]>;
  QueueConfigurations: Value<QueueConfiguration[]>;
  TopicConfigurations: Value<TopicConfiguration[]>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html
interface NotificationFilter {
  S3Key: Value<S3KeyFilter>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockconfiguration.html
interface ObjectLockConfiguration {
  ObjectLockEnabled: 'Enabled';
  Rule: Value<ObjectLockRule>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockrule.html
interface ObjectLockRule {
  DefaultRetention?: Value<DefaultRetention>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrols.html
interface OwnershipControls {
  Rules: Value<OwnershipControlsRule[]>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrolsrule.html
interface OwnershipControlsRule {
  ObjectOwnership?: Value<'BucketOwnerEnforced' | 'ObjectWriter' | 'BucketOwnerPreferred'>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html
interface PublicAccessBlockConfiguration {
  BlockPublicAcls?: Value<boolean>;
  BlockPublicPolicy?: Value<boolean>;
  IgnorePublicAcls?: Value<boolean>;
  RestrictPublicBuckets?: Value<boolean>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-queueconfig.html
interface QueueConfiguration {
  Event: Value<string>;
  Filter?: Value<NotificationFilter>;
  Queue: Value<string>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-redirectallrequeststo.html
interface RedirectAllRequestsTo {
  HostName: Value<string>;
  Protocol?: Value<'http' | 'https'>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-redirectrule.html
interface RedirectRule {
  HostName?: Value<string>;
  HttpRedirectCode?: Value<string>;
  Protocol?: Value<'http' | 'https'>;
  ReplaceKeyPrefixWith?: Value<string>;
  ReplaceKeyWith?: Value<string>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicamodifications.html
interface ReplicaModifications {
  Status: Value<'Disabled' | 'Enabled'>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration.html
interface ReplicationConfiguration {
  Role: Value<string>;
  Rules: Value<ReplicationRule[]>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html
interface ReplicationDestination {
  AccessControlTranslation?: Value<AccessControlTranslation>;
  Account?: Value<string>;
  Bucket: Value<string>;
  EncryptionConfiguration?: Value<EncryptionConfiguration>;
  Metrics?: Value<Metrics>;
  ReplicationTime?: Value<ReplicationTime>;
  StorageClass?: Value<string>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html
interface ReplicationRule {
  DeleteMarkerReplication?: Value<DeleteMarkerReplication>;
  Destination: Value<ReplicationDestination>;
  Filter?: Value<ReplicationRuleFilter>;
  Id?: Value<string>;
  Prefix?: Value<string>;
  Priority?: Value<number>;
  SourceSelectionCriteria?: Value<SourceSelectionCriteria>;
  Status: Value<'Disabled' | 'Enabled'>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationruleandoperator.html
interface ReplicationRuleAndOperator {
  Prefix?: Value<string>;
  TagFilters?: Value<TagFilter[]>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrulefilter.html
interface ReplicationRuleFilter {
  And?: Value<ReplicationRuleAndOperator>;
  Prefix?: Value<string>;
  TagFilter?: Value<TagFilter>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtime.html
interface ReplicationTime {
  Status: Value<'Disabled' | 'Enabled'>;
  Time: Value<ReplicationTimeValue>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtimevalue.html
interface ReplicationTimeValue {
  Minutes: 15;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules.html
interface RoutingRule {
  RedirectRule: Value<RedirectRule>;
  RoutingRuleCondition?: Value<RoutingRuleCondition>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-routingrulecondition.html
interface RoutingRuleCondition {
  HttpErrorCodeReturnedEquals?: Value<string>;
  KeyPrefixEquals?: Value<string>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html
interface Rule {
  AbortIncompleteMultipartUpload?: Value<AbortIncompleteMultipartUpload>;
  ExpirationDate?: Value<number>;
  ExpirationInDays?: Value<number>;
  ExpiredObjectDeleteMarker?: Value<boolean>;
  Id?: Value<string>;
  NoncurrentVersionExpiration?: Value<NoncurrentVersionExpiration>;
  NoncurrentVersionExpirationInDays?: Value<number>;
  NoncurrentVersionTransition?: Value<NoncurrentVersionTransition>;
  NoncurrentVersionTransitions?: Value<NoncurrentVersionTransition[]>;
  ObjectSizeGreaterThan?: Value<number>;
  ObjectSizeLessThan?: Value<number>;
  Prefix?: Value<string>;
  Status: Value<'Disabled' | 'Enabled'>;
  TagFilters?: Value<TagFilter[]>;
  Transition?: Value<Transition>;
  Transitions?: Value<Transition[]>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key.html
interface S3KeyFilter {
  Rules: Value<FilterRule[]>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html
interface ServerSideEncryptionByDefault {
  KMSMasterKeyID?: Value<string>;
  SSEAlgorithm: Value<'AES256' | 'aws:kms'>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionrule.html
interface ServerSideEncryptionRule {
  BucketKeyEnabled?: Value<boolean>;
  ServerSideEncryptionByDefault?: Value<ServerSideEncryptionByDefault>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-sourceselectioncriteria.html
interface SourceSelectionCriteria {
  ReplicaModifications?: Value<ReplicaModifications>;
  SseKmsEncryptedObjects?: Value<SseKmsEncryptedObjects>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ssekmsencryptedobjects.html
interface SseKmsEncryptedObjects {
  Status: Value<'Disabled' | 'Enabled'>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-storageclassanalysis.html
interface StorageClassAnalysis {
  DataExport?: Value<DataExport>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tagfilter.html
interface TagFilter {
  Key: Value<string>;
  Value: Value<string>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tiering.html
interface Tiering {
  AccessTier: Value<'ARCHIVE_ACCESS' | 'DEEP_ARCHIVE_ACCESS'>;
  Days: Value<number>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-topicconfig.html
interface TopicConfiguration {
  Event: Value<string>;
  Filter?: Value<NotificationFilter>;
  Topic: Value<string>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-transition.html
interface Transition {
  StorageClass: Value<'DEEP_ARCHIVE' | 'GLACIER' | 'GLACIER_IR' | 'INTELLIGENT_TIERING' | 'ONEZONE_IA' | 'STANDARD_IA'>;
  TransitionDate?: Value<number>;
  TransitionInDays?: Value<number>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-versioningconfig.html
interface VersioningConfiguration {
  Status: Value<'Disabled' | 'Enabled'>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html
interface WebsiteConfiguration {
  ErrorDocument?: Value<string>;
  IndexDocument?: Value<string>;
  RedirectAllRequestsTo?: Value<RedirectAllRequestsTo>;
  RoutingRules?: Value<RoutingRule[]>;
}
