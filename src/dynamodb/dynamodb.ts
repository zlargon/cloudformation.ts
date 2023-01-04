export interface DynamoDBTableResource {
  Properties: {
    TableName: string;

    AttributeDefinitions: {
      AttributeName: string;
      AttributeType: 'S';
    }[];

    KeySchema: {
      AttributeName: string;
      KeyType: 'HASH';
    }[];

    ProvisionedThroughput: {
      ReadCapacityUnits: number;
      WriteCapacityUnits: number;
    };
  };
}

export const create_dynamodb_table_resource = (resource: DynamoDBTableResource) => {
  return { Type: 'AWS::DynamoDB::Table', ...resource };
};
