import { CloudFormation_Interface } from './CloudFormation_Interface.ts';
import { Fn_FindInMap } from './Fn_FindInMap.ts';
import { Parameter } from './Parameter.ts';
import { Ref } from './Ref.ts';
import { Resource } from './Resource.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html
interface Stack {
  AWSTemplateFormatVersion: '2010-09-09';
  Description?: string;
  Metadata?: {
    'AWS::CloudFormation::Interface'?: CloudFormation_Interface;
  };
  Parameters?: Record<string, Parameter>;
  Mappings?: Record<string, Record<string, unknown>>;
  Resources: Record<string, Resource>;
}

function getCloudFormationInterface(stack: Stack) {
  const type = 'AWS::CloudFormation::Interface';
  if (typeof stack.Metadata === 'undefined') {
    stack.Metadata = {};
  }
  if (typeof stack.Metadata[type] === 'undefined') {
    stack.Metadata[type] = {
      ParameterGroups: undefined,
      ParameterLabels: undefined,
    };
  }
  return stack.Metadata[type];
}

function createLogicalReference(LogicalNameSet: Set<string>, logicalName: string) {
  if (LogicalNameSet.has(logicalName)) {
    throw new Error(`logical name '${logicalName}' has been used.`);
  }
  LogicalNameSet.add(logicalName);

  return {
    Name: () => logicalName,
    Ref: () => Ref(logicalName),
  };
}

export function Stack() {
  const LogicalNameSet = new Set<string>();
  const stack: Stack = {
    AWSTemplateFormatVersion: '2010-09-09',
    Description: undefined,
    Metadata: undefined,
    Parameters: undefined,
    Mappings: undefined,
    Resources: {},
  };

  return {
    setDescription(description: string) {
      // convert to single line, and trim the leading and trailing spaces
      description = description.replaceAll('\n', ' ').trim();

      if (description.length > 1024) {
        throw new Error('must be a literal string that is between 0 and 1024 bytes in length');
      }
      stack.Description = description;
    },

    metadata: {
      addParameterGroup(label: string, parameters: string[]) {
        const metadata = getCloudFormationInterface(stack);
        if (typeof metadata.ParameterGroups === 'undefined') {
          metadata.ParameterGroups = [];
        }
        metadata.ParameterGroups.push({
          Label: { default: label },
          Parameters: parameters,
        });
      },
      addParameterLabel(parameterLogicalId: string, label: string) {
        const metadata = getCloudFormationInterface(stack);
        if (typeof metadata.ParameterLabels === 'undefined') {
          metadata.ParameterLabels = {};
        }
        metadata.ParameterLabels[parameterLogicalId] = { default: label };
      },
    },

    addParameter(logicalName: string, parameter: Parameter) {
      if (typeof stack.Parameters === 'undefined') {
        stack.Parameters = {};
      }
      stack.Parameters[logicalName] = parameter;

      return createLogicalReference(LogicalNameSet, logicalName);
    },

    addMapping<MapKey extends string, MapValue>(MapName: string, maps: Record<MapKey, MapValue>) {
      if (typeof stack.Mappings === 'undefined') {
        stack.Mappings = {};
      }
      stack.Mappings[MapName] = maps;

      return (TopLevelKey: MapKey | Ref, SecondLevelKey: keyof MapValue) => {
        return Fn_FindInMap<typeof maps>({ MapName, TopLevelKey, SecondLevelKey });
      };
    },

    addResource(logicalName: string, resource: Resource) {
      stack.Resources[logicalName] = resource;

      return createLogicalReference(LogicalNameSet, logicalName);
    },

    json() {
      return JSON.stringify(stack, null, 4);
    },
  };
}
