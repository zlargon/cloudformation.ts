import { ResourceAttributes } from './ResourceAttributes.ts';
import { Tag } from './Tag.ts';
import { Value } from './Value.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html
export interface RDS_DBInstance extends ResourceAttributes {
  Type: 'AWS::RDS::DBInstance';
  Properties?: {
    AllocatedStorage?: Value<number>;
    AllowMajorVersionUpgrade?: Value<boolean>;
    AssociatedRoles?: Value<DBInstanceRole[]>;
    AutoMinorVersionUpgrade?: Value<boolean>;
    AvailabilityZone?: Value<string>;
    BackupRetentionPeriod?: Value<number>;
    CACertificateIdentifier?: Value<string>;
    CharacterSetName?: Value<string>;
    CopyTagsToSnapshot?: Value<boolean>;
    CustomIAMInstanceProfile?: Value<string>;
    DBClusterIdentifier?: Value<string>;
    DBClusterSnapshotIdentifier?: Value<string>;
    DBInstanceClass?: Value<string>;
    DBInstanceIdentifier?: Value<string>;
    DBName?: Value<string>;
    DBParameterGroupName?: Value<string>;
    DBSecurityGroups?: Value<string>[];
    DBSnapshotIdentifier?: Value<string>;
    DBSubnetGroupName?: Value<string>;
    DeleteAutomatedBackups?: Value<boolean>;
    DeletionProtection?: Value<boolean>;
    Domain?: Value<string>;
    DomainIAMRoleName?: Value<string>;
    EnableCloudwatchLogsExports?: Value<string>[];
    EnableIAMDatabaseAuthentication?: Value<boolean>;
    EnablePerformanceInsights?: Value<boolean>;
    Endpoint?: Value<Endpoint>;
    Engine?: Value<Engine>;
    EngineVersion?: Value<string>;
    Iops?: Value<number>;
    KmsKeyId?: Value<string>;
    LicenseModel?: Value<
      'postgresql-license' | 'general-public-license' | 'license-included' | 'bring-your-own-license'
    >;
    MasterUsername?: Value<string>;
    MasterUserPassword?: Value<string>;
    MaxAllocatedStorage?: Value<number>;
    MonitoringInterval?: Value<0 | 1 | 5 | 10 | 15 | 30 | 60>;
    MonitoringRoleArn?: Value<string>;
    MultiAZ?: Value<boolean>;
    NcharCharacterSetName?: Value<string>;
    NetworkType?: Value<'IPV4' | 'DUAL'>;
    OptionGroupName?: Value<string>;
    PerformanceInsightsKMSKeyId?: Value<string>;
    PerformanceInsightsRetentionPeriod?: Value<number>;
    Port?: Value<string>;
    PreferredBackupWindow?: Value<string>;
    PreferredMaintenanceWindow?: Value<string>;
    ProcessorFeatures?: Value<ProcessorFeature[]>;
    PromotionTier?: Value<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15>;
    PubliclyAccessible?: Value<boolean>;
    ReplicaMode?: Value<'open-read-only' | 'mounted'>;
    RestoreTime?: Value<string>;
    SourceDBInstanceAutomatedBackupsArn?: Value<string>;
    SourceDBInstanceIdentifier?: Value<string>;
    SourceDbiResourceId?: Value<string>;
    SourceRegion?: Value<string>;
    StorageEncrypted?: Value<boolean>;
    StorageThroughput?: Value<number>;
    StorageType?: Value<'gp2' | 'gp3' | 'io1' | 'standard'>;
    Tags?: Tag[];
    Timezone?: Value<string>;
    UseDefaultProcessorFeatures?: Value<boolean>;
    UseLatestRestorableTime?: Value<boolean>;
    VPCSecurityGroups?: Value<string>[];
  };
}

type Engine =
  | 'aurora'
  | 'aurora-mysql'
  | 'aurora-postgresql'
  | 'mariadb'
  | 'mysql'
  | 'oracle-ee'
  | 'oracle-ee-cdb'
  | 'oracle-se2'
  | 'oracle-se2-cdb'
  | 'postgres'
  | 'sqlserver-ee'
  | 'sqlserver-se'
  | 'sqlserver-ex'
  | 'sqlserver-web';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-dbinstancerole.html
interface DBInstanceRole {
  FeatureName: Value<string>;
  RoleArn: Value<string>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-endpoint.html
interface Endpoint {
  Address?: Value<string>;
  HostedZoneId?: Value<string>;
  Port?: Value<string>;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-processorfeature.html
interface ProcessorFeature {
  Name?: Value<string>;
  Value?: Value<string>;
}
