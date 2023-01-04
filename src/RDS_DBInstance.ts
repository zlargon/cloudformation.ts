import { Tag } from './Tag.ts';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html
export interface RDS_DBInstance {
  Type: 'AWS::RDS::DBInstance';
  DeletionPolicy?: 'Delete' | 'Retain' | 'Snapshot';
  Properties?: {
    AllocatedStorage?: number;
    AllowMajorVersionUpgrade?: boolean;
    AssociatedRoles?: DBInstanceRole[];
    AutoMinorVersionUpgrade?: boolean;
    AvailabilityZone?: string;
    BackupRetentionPeriod?: number;
    CACertificateIdentifier?: string;
    CharacterSetName?: string;
    CopyTagsToSnapshot?: boolean;
    CustomIAMInstanceProfile?: string;
    DBClusterIdentifier?: string;
    DBClusterSnapshotIdentifier?: string;
    DBInstanceClass?: string;
    DBInstanceIdentifier?: string;
    DBName?: string;
    DBParameterGroupName?: string;
    DBSecurityGroups?: string[];
    DBSnapshotIdentifier?: string;
    DBSubnetGroupName?: string;
    DeleteAutomatedBackups?: boolean;
    DeletionProtection?: boolean;
    Domain?: string;
    DomainIAMRoleName?: string;
    EnableCloudwatchLogsExports?: string[];
    EnableIAMDatabaseAuthentication?: boolean;
    EnablePerformanceInsights?: boolean;
    Endpoint?: Endpoint;
    Engine?: Engine;
    EngineVersion?: string;
    Iops?: number;
    KmsKeyId?: string;
    LicenseModel?: 'postgresql-license' | 'general-public-license' | 'license-included' | 'bring-your-own-license';
    MasterUsername?: string;
    MasterUserPassword?: string;
    MaxAllocatedStorage?: number;
    MonitoringInterval?: 0 | 1 | 5 | 10 | 15 | 30 | 60;
    MonitoringRoleArn?: string;
    MultiAZ?: boolean;
    NcharCharacterSetName?: string;
    NetworkType?: 'IPV4' | 'DUAL';
    OptionGroupName?: string;
    PerformanceInsightsKMSKeyId?: string;
    PerformanceInsightsRetentionPeriod?: number;
    Port?: string;
    PreferredBackupWindow?: string;
    PreferredMaintenanceWindow?: string;
    ProcessorFeatures?: ProcessorFeature[];
    PromotionTier?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
    PubliclyAccessible?: boolean;
    ReplicaMode?: 'open-read-only' | 'mounted';
    RestoreTime?: string;
    SourceDBInstanceAutomatedBackupsArn?: string;
    SourceDBInstanceIdentifier?: string;
    SourceDbiResourceId?: string;
    SourceRegion?: string;
    StorageEncrypted?: boolean;
    StorageThroughput?: number;
    StorageType?: 'gp2' | 'gp3' | 'io1' | 'standard';
    Tags?: Tag[];
    Timezone?: string;
    UseDefaultProcessorFeatures?: boolean;
    UseLatestRestorableTime?: boolean;
    VPCSecurityGroups?: string[];
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
  FeatureName: string;
  RoleArn: string;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-endpoint.html
interface Endpoint {
  Address?: string;
  HostedZoneId?: string;
  Port?: string;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-processorfeature.html
interface ProcessorFeature {
  Name?: string;
  Value?: string;
}
