import { ResourceAttributes } from './ResourceAttributes.ts';
import { Tag } from './Tag.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html
export interface SQS_Queue extends ResourceAttributes {
  Type: 'AWS::SQS::Queue';
  Properties?: {
    ContentBasedDeduplication?: boolean;
    DeduplicationScope?: 'queue' | 'messageGroup';
    DelaySeconds?: number;
    FifoQueue?: boolean;
    FifoThroughputLimit?: 'perQueue' | 'perMessageGroupId';
    KmsDataKeyReusePeriodSeconds?: number;
    KmsMasterKeyId?: string;
    MaximumMessageSize?: number;
    MessageRetentionPeriod?: number;
    QueueName?: string;
    ReceiveMessageWaitTimeSeconds?: number;
    RedriveAllowPolicy?: RedriveAllowPolicy;
    RedrivePolicy?: RedrivePolicy;
    SqsManagedSseEnabled?: boolean;
    Tags?: Tag[];
    VisibilityTimeout?: number;
  };
}

interface RedriveAllowPolicy {
  redrivePermission: 'allowAll' | 'denyAll' | 'byQueue';
  sourceQueueArns: string;
}

interface RedrivePolicy {
  deadLetterTargetArn: string;
  maxReceiveCount: number;
}
