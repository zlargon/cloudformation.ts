import { Tag } from './Tag.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html
export interface SNS_Topic {
  Type: 'AWS::SNS::Topic';
  Properties?: {
    ContentBasedDeduplication?: boolean;
    DataProtectionPolicy?: string;
    DisplayName?: string;
    FifoTopic?: boolean;
    KmsMasterKeyId?: string;
    SignatureVersion?: string;
    Subscription?: Subscription[];
    Tags?: Tag[];
    TopicName?: string;
  };
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic-subscription.html
interface Subscription {
  Endpoint: string;
  Protocol: string;
}
