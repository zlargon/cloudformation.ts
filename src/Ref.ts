// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref.html
export interface Ref {
  Ref: string;
}

export function Ref(logicalName: string): Ref {
  return { Ref: logicalName };
}
