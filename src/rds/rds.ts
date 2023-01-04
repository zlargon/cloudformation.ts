export interface RdsDbInstanceResource {
  DeletionPolicy: 'Delete';
  Properties: {
    Engine: 'mariadb';
    DBInstanceClass: 'db.t2.micro';
    DBInstanceIdentifier: string;
    MultiAZ: boolean;
    MasterUsername: string;
    MasterUserPassword: string;
    AllocatedStorage: number;
    StorageType: 'gp2';
    BackupRetentionPeriod: number;
  };
}

export const create_rds_db_instance_resource = (resource: RdsDbInstanceResource) => {
  return { Type: 'AWS::RDS::DBInstance', ...resource };
};
