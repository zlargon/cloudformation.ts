import { PseudoParameterSet } from './PseudoParameter.ts';
import { Value } from './Value.ts';

export interface SubValue {
  'Fn::Sub': string | [string, Record<string, Value>];
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-sub.html
export const Fn_Sub = (stringTemplate: string, keyValuePair?: Record<string, Value>): SubValue => {
  const params = stringTemplate.match(/\$\{[^\$\{\}]+\}/g) ?? [];

  for (const paramWithBracket of params) {
    const param = paramWithBracket.slice(2, -1); // remove ${ and }

    // To write a dollar sign and curly braces (${}) literally, add an
    // exclamation point (!) after the open curly brace, such as ${!Literal}.
    // CloudFormation resolves this text as ${Literal}.
    if (param.charAt(0) === '!') continue;

    // Valid pseudo parameter
    if (PseudoParameterSet.has(param)) continue;

    // key value pair
    if (typeof keyValuePair === 'undefined' || !(param in keyValuePair)) {
      const msg = `${paramWithBracket} doesn't exist in the keyValuePair. Might be a Resource, Parameter, or Invalid Parameter.`;
      console.warn(msg);
    }
  }

  return {
    'Fn::Sub':
      typeof keyValuePair === 'undefined'
        ? stringTemplate //
        : [stringTemplate, keyValuePair],
  };
};
