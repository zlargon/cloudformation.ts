import { CloudFormation_Interface } from './CloudFormation_Interface.ts';
import { Condition } from './Conditions.ts';
import { Fn_FindInMap } from './Fn_FindInMap.ts';
import { Fn_GetAtt } from './Fn_GetAtt.ts';
import { Output } from './Output.ts';
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
  Conditions?: Record<string, Condition>;
  Resources: Record<string, Resource>;
  Outputs?: Record<string, Output>;
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

export function Stack() {
  const LogicalNameSet = new Set<string>();
  const LogicalConditionSet = new Set<string>();
  const stack: Stack = {
    AWSTemplateFormatVersion: '2010-09-09',
    Description: undefined,
    Metadata: undefined,
    Parameters: undefined,
    Mappings: undefined,
    Conditions: undefined,
    Resources: {},
    Outputs: undefined,
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

      if (LogicalNameSet.has(logicalName)) {
        throw new Error(`logical name '${logicalName}' has been used.`);
      }
      LogicalNameSet.add(logicalName);

      return {
        Name: () => logicalName,
        Ref: () => Ref(logicalName),
      };
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

    addCondition(logicalName: string, condition: Condition) {
      if (typeof stack.Conditions === 'undefined') {
        stack.Conditions = {};
      }
      stack.Conditions[logicalName] = condition;

      // check duplicated condition
      if (LogicalConditionSet.has(logicalName)) {
        throw new Error(`logical condition name '${logicalName}' has been used.`);
      }
      LogicalConditionSet.add(logicalName);

      return {
        Condition: () => logicalName,
      };
    },

    addResource(logicalName: string, resource: Resource) {
      stack.Resources[logicalName] = resource;

      if (LogicalNameSet.has(logicalName)) {
        throw new Error(`logical name '${logicalName}' has been used.`);
      }
      LogicalNameSet.add(logicalName);

      return {
        Name: () => logicalName,
        Ref: () => Ref(logicalName),
        Attr: (attributeName: string) => {
          return Fn_GetAtt(logicalName, attributeName);
        },
      };
    },

    addOutput(logicalName: string, output: Output) {
      if (typeof stack.Outputs === 'undefined') {
        stack.Outputs = {};
      }
      stack.Outputs[logicalName] = output;

      // check duplicated outputs
      if (LogicalNameSet.has(logicalName)) {
        throw new Error(`logical name '${logicalName}' has been used.`);
      }
      LogicalNameSet.add(logicalName);
    },

    json() {
      return JSON.stringify(stack, null, 4);
    },
  };
}
