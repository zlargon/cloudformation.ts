import { Ref } from './Ref.ts';
import { ResourceAttributes } from './ResourceAttributes.ts';
import { Tag } from './Tag.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsubnetgroup.html
export interface RDS_DBSubnetGroup extends ResourceAttributes {
  Type: 'AWS::RDS::DBSubnetGroup';
  Properties: {
    DBSubnetGroupDescription: string;
    DBSubnetGroupName?: string;
    SubnetIds: (string | Ref)[];
    Tags?: Tag[];
  };
}
