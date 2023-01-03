interface Stack {
  Description: string;
}

export const create_stack = ({ Description }: Stack) => {
  const Resources: Record<string, unknown> = {};

  return {
    resource: {
      add_sqs_queue(name: string, Properties?: Record<string, string>) {
        Resources[name] = {
          Type: 'AWS::SQS::Queue',
          Properties,
        };
      },

      add_sns_topic(name: string, Properties?: Record<string, string>) {
        Resources[name] = {
          Type: 'AWS::SNS::Topic',
          Properties,
        };
      },
    },

    json() {
      const stack = {
        AWSTemplateFormatVersion: '2010-09-09',
        Description,
        Resources,
      };
      return JSON.stringify(stack, null, 4);
    },
  };
};
