import { Resource } from './Resource.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html
interface Stack {
  AWSTemplateFormatVersion: '2010-09-09';
  Description?: string;
  Resources: Record<string, Resource>;
}

export function Stack() {
  const stack: Stack = {
    AWSTemplateFormatVersion: '2010-09-09',
    Description: undefined,
    Resources: {},
  };

  return {
    setDescription(description: string) {
      if (description.length > 1024) {
        throw new Error('must be a literal string that is between 0 and 1024 bytes in length');
      }
      stack.Description = description;
    },

    addResource(name: string, resource: Resource) {
      stack.Resources[name] = resource;
    },

    json() {
      return JSON.stringify(stack, null, 4);
    },
  };
}
