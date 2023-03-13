import { CloudFormation_Interface } from './CloudFormation_Interface.ts';
import { Condition } from './Conditions.ts';
import { Fn_FindInMap } from './Fn_FindInMap.ts';
import { Fn_GetAtt } from './Fn_GetAtt.ts';
import { Output } from './Output.ts';
import { Parameter } from './Parameter.ts';
import { Ref } from './Ref.ts';
import { Resource } from './Resource.ts';
import { Value } from './Value.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html
interface StackData {
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

type StackOption = { Description: string };
type DeployOption = { stackName: string; awsProfile?: string };

export function createStack({ Description }: StackOption) {
  const LogicalNameSet = new Set<string>();
  const OutputLogicalNameSet = new Set<string>();
  const LogicalConditionSet = new Set<string>();
  const stack: StackData = {
    AWSTemplateFormatVersion: '2010-09-09',
    Description: formatDescription(Description),
    Metadata: undefined,
    Parameters: undefined,
    Mappings: undefined,
    Conditions: undefined,
    Resources: {},
    Outputs: undefined,
  };

  return {
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

      // check duplicated parameter
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

      return (TopLevelKey: Value<MapKey>, SecondLevelKey: Value<keyof MapValue>) => {
        return Fn_FindInMap<MapKey, MapValue>({ MapName, TopLevelKey, SecondLevelKey });
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

      // check duplicated resource
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
      if (OutputLogicalNameSet.has(logicalName)) {
        throw new Error(`Output logical name '${logicalName}' has been used.`);
      }
      OutputLogicalNameSet.add(logicalName);
    },

    json() {
      return JSON.stringify(stack, null, 4);
    },

    /**
     *
     * @param DeployOption.stackName : the cloud formation stack name
     * @param DeployOption.awsProfile : (optional) for AWS_PROFILE. The default value is 'default'
     */
    async deploy({ stackName, awsProfile = 'default' }: DeployOption) {
      const cmd = ['rain', 'deploy', `${stackName}.json`, stackName];

      console.log('\n\n--------------------------------------------------\n\n');
      console.log('Deploy cloud formation stack:\n');
      console.log(`  1. Stack name => ${stackName}\n`);
      console.log(`  2. Use AWS_PROFILE => ${awsProfile}\n`);
      console.log(`  3. Generate cloud formation template file => ./${stackName}.json\n`);
      console.log(`  4. Deploy cloud formation template by command => ${cmd.join(' ')}`);
      console.log('\n\n--------------------------------------------------\n\n');

      Deno.env.set('AWS_PROFILE', awsProfile);
      await Deno.writeTextFile(`./${stackName}.json`, this.json());
      await Deno.run({ cmd, stderr: 'inherit' }).status();
      console.log('');
    },
  };
}

function formatDescription(description: string) {
  // convert to single line, and trim the leading and trailing spaces
  description = description.replaceAll('\n', ' ').trim();

  if (description.length > 1024) {
    throw new Error('must be a literal string that is between 0 and 1024 bytes in length');
  }
  return description;
}

function getCloudFormationInterface(stack: StackData) {
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

export type createStack = ReturnType<typeof createStack>;
