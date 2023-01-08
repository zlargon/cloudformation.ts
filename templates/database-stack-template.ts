#!/usr/bin/env -S deno run
import { Ref } from '../src/Ref.ts';
import { Stack } from '../src/Stack.ts';

const Constant = {
  // Parameters
  DbClass: 'DbClass',

  // Resources
  DbSecurityGroup: 'DbSecurityGroup',
  DbSubnetGroup: 'DbSubnetGroup',
  DatabaseInstance: 'DatabaseInstance',
};

const stack = Stack();
stack.setDescription('Sample database stack for the Parameters section');

// ========================================================
// Parameters
// ========================================================
stack.addParameter(Constant.DbClass, {
  Type: 'String',
  Description: 'RDS instance class',
  Default: 'db.t2.micro',
});

// ========================================================
// Resources
// ========================================================
stack.addResource(Constant.DbSecurityGroup, {
  Type: 'AWS::EC2::SecurityGroup',
  Properties: {
    // Note: Please replace the value of VpcId property with the VPC id of your default VPC
    VpcId: 'vpc-0f68633eddd78fd56', // default vpc
    GroupDescription: 'Database instances security group',
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0',
        FromPort: 3306,
        ToPort: 3306,
        IpProtocol: 'tcp',
      },
    ],
  },
});

stack.addResource(Constant.DbSubnetGroup, {
  Type: 'AWS::RDS::DBSubnetGroup',
  Properties: {
    DBSubnetGroupDescription: 'Subnets to launch db instances into',
    SubnetIds: [
      // Note: Please replace the value of SubnetIds property with the subnet ids of the subnets in your default VPC!
      'subnet-0cc9fb7c1b70c570d',
      'subnet-0ceeb2182a2063f9d',
      'subnet-0acd8489903e7a0fb',
      'subnet-09227140fb95e095d',
      'subnet-0d08f018f7b018712',
      'subnet-061ed6fc8545869bd',
    ],
  },
});

// mysql -u dbadmin -p12345678 -h xxxx.xxxx.us-east-1.rds.amazonaws.com
stack.addResource(Constant.DatabaseInstance, {
  Type: 'AWS::RDS::DBInstance',
  Properties: {
    DBInstanceClass: Ref(Constant.DbClass),
    Engine: 'mysql',
    MultiAZ: false,
    PubliclyAccessible: true,
    AllocatedStorage: 8,
    MasterUsername: 'dbadmin',
    MasterUserPassword: '12345678',
    DBSubnetGroupName: Ref(Constant.DbSubnetGroup),
    VPCSecurityGroups: [
      Ref(Constant.DbSecurityGroup), //
    ],
  },
});

console.log(stack.json());
