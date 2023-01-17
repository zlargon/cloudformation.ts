import { Value } from './Value.ts';

export interface MappingValue {
  'Fn::FindInMap': [
    string, // MapName
    Value, // TopLevelKey
    Value // SecondLevelKey
  ];
}

interface Fn_FindInMap_Props<MapKey extends string, MapValue> {
  MapName: string;
  TopLevelKey: Value<MapKey>;
  SecondLevelKey: Value<keyof MapValue>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-findinmap-enhancements.html
export const Fn_FindInMap = <MapKey extends string, MapValue>({
  MapName,
  TopLevelKey,
  SecondLevelKey,
}: Fn_FindInMap_Props<MapKey, MapValue>): MappingValue => {
  return {
    'Fn::FindInMap': [
      MapName, //
      TopLevelKey,
      SecondLevelKey,
    ],
  };
};
