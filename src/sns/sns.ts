export interface SnsTopicResource {
  Properties: {
    DisplayName: string;
  };
}

export const create_sns_topic_resource = (resource: SnsTopicResource) => {
  return { Type: 'AWS::SNS::Topic', ...resource };
};
