const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const IAM = new AWS.IAM();
const EC2 = new AWS.EC2();

// Class: UpdateLambdaRolePolicy
// Summary: Updates Bucket Policy
class UpdateLambdaRolePolicy {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider("aws");

    this.commands = {
      s3deploy: {
        usage: "updates a role policy to allow only vpc endpoint",
        lifecycleEvents: ["deploy"],
      },
    };

    this.hooks = {
      "after:deploy:finalize": () =>
        Promise.resolve().then(this.uLambdaRolePolicy.bind(this)),
    };
  }

  // Function: uLambdaRolePolicy
  // Summary: Updates bucket policy to only be accessed from vpc
  async uLambdaRolePolicy() {
    let policyName = this.serverless.service.custom.POLICY_NAME;
    let roleName = this.serverless.service.custom.ROLE_NAME;
    let vpcId = this.serverless.service.custom.VPCID;
    let region = this.serverless.service.provider.region;
    let dynamoARN = this.serverless.service.custom.DYNAMODB_ARN;

    this.serverless.cli.log("Plugin: Updating bucket policy " + vpcId);

    let vpcParams = {
      Filters: [
        {
          Name: "vpc-id",
          Values: [vpcId],
        },
        {
          Name: "service-name",
          Values: ["com.amazonaws." + region + ".dynamodb"],
        },
      ],
    };

    let res = await EC2.describeVpcEndpoints(vpcParams).promise();

    let vpcEId = res.VpcEndpoints[0].VpcEndpointId;

    this.serverless.cli.log("Plugin: My DynamoDB VPC endpoint Id " + vpcEId);

    this.serverless.cli.log("Plugin: Updating role policy " + roleName);

    var policyParams = {
      PolicyDocument:
        '{"Version":"2008-10-17","Statement":[{"Action":["s3:*"],"Resource":"*","Effect":"Allow"},{"Action":["dynamodb:*"],"Resource":"' +
        dynamoARN +
        '","Effect":"Deny","Condition":{"StringNotEquals":{"aws:SourceVpce":"' +
        vpcEId +
        '"}}}]}',
      PolicyName: policyName,
      RoleName: roleName,
    };

    this.serverless.cli.log('{"Version":"2008-10-17","Statement":[{"Action":["s3:*"],"Resource":"*","Effect":"Allow"},{"Action":["dynamodb:*"],"Resource":"' +
      dynamoARN +
      '","Effect":"Deny","Condition":{"StringNotEquals":{"aws:SourceVpce":"' +
      vpcEId +
      '"}}}]}');

    let policyRes = await IAM.putRolePolicy(policyParams).promise();

    this.serverless.cli.log("Plugin: IAM role policy applied.");
  }
}

module.exports = UpdateLambdaRolePolicy;
