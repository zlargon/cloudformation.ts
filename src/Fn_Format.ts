import { Fn_Sub, SubValue } from './Fn_Sub.ts';
import { isValidPseudoParameter } from './PseudoParameter.ts';

// This is not a standard cloud formation intrinsic function
export const Fn_Format = (
  stringTemplate: string,
  keyValuePair: Record<string, unknown>
): string | Exclude<SubValue, string> => {
  const params = new Set(stringTemplate.match(/\{\{[A-Za-z0-9]+\}\}/g));

  let hasPseudoParameter = false;
  for (const paramWithBracket of params) {
    const paramName = paramWithBracket.slice(2, -2); // remove {{ and }}
    if (!(paramName in keyValuePair)) {
      throw new Error(`Invalid parameter ${paramWithBracket}. It doesn't exist in the keyValuePair`);
    }

    const paramValue = keyValuePair[paramName];

    // pseudo parameter
    if (typeof paramValue === 'string' && isValidPseudoParameter(paramValue)) {
      stringTemplate = stringTemplate.replaceAll(paramWithBracket, '${' + paramValue + '}');
      delete keyValuePair[paramName];
      hasPseudoParameter = true;
      continue;
    }

    // native values
    if (typeof paramValue === 'string' || typeof paramValue === 'number' || typeof paramValue === 'boolean') {
      stringTemplate = stringTemplate.replaceAll(paramWithBracket, String(paramValue));
      delete keyValuePair[paramName];
      continue;
    }

    // object values (e.g. Ref)
    stringTemplate = stringTemplate.replaceAll(paramWithBracket, '${' + paramName + '}');
  }

  // no pseudo parameter and no object values
  const isKeyValuePairEmpty = Object.keys(keyValuePair).length === 0;
  if (!hasPseudoParameter && isKeyValuePairEmpty) {
    return stringTemplate;
  }

  return Fn_Sub(stringTemplate, isKeyValuePairEmpty ? undefined : keyValuePair);
};
