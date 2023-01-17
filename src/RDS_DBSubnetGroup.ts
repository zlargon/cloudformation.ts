import { ResourceAttributes } from './ResourceAttributes.ts';
import { Tag } from './Tag.ts';
import { Value } from './Value.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsubnetgroup.html
export interface RDS_DBSubnetGroup extends ResourceAttributes {
  Type: 'AWS::RDS::DBSubnetGroup';
  Properties: {
    DBSubnetGroupDescription: Value<string>;
    DBSubnetGroupName?: Value<string>;
    SubnetIds: Value<string>[] | Value<string>;
    Tags?: Tag[];
  };
}
