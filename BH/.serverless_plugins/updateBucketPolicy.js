const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const S3 = new AWS.S3();
const EC2 = new AWS.EC2();
const SSM = new AWS.SSM({region: 'us-east-1'});

// Class: UpdateBucketPolicy
// Summary: Updates Bucket Policy
class UpdateBucketPolicy {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider("aws");

    this.commands = {
      s3deploy: {
        usage: "updates a bucket policy to allow only vpc endpoint",
        lifecycleEvents: ["deploy"],
      },
    };

    this.hooks = {
      "after:deploy:finalize": () =>
        Promise.resolve().then(this.uBucketPolicy.bind(this)),
    };
  }

  // Function: uBucketPolicy
  // Summary: Updates bucket policy to only be accessed from vpc
  async uBucketPolicy() {
    let region = this.serverless.service.provider.region;
    let bucketName = this.serverless.service.custom.SOURCE_BUCKET_NAME;
    let bucketARN = this.serverless.service.custom.SOURCE_BUCKET_ARN;
    let paramNameVPCId = this.serverless.service.custom.SSM_PARAM_VPCID;

    this.serverless.cli.log("Plugin - Update Bucket Policy: Getting SSM parameter for VPC Id");

    var ssmParams = {
      Name: paramNameVPCId,
      WithDecryption: false
    };

    let ssmRes = await SSM.getParameter(ssmParams).promise();

    let vpcId = ssmRes.Parameter.Value;

    this.serverless.cli.log("Plugin - Update Bucket Policy: Updating bucket policy " + vpcId);

    let vpcParams = {
      Filters: [
        {
          Name: "vpc-id",
          Values: [vpcId],
        },
        {
          Name: "service-name",
          Values: ["com.amazonaws." + region + ".s3"],
        },
      ],
    };

    let res = await EC2.describeVpcEndpoints(vpcParams).promise();

    let vpcEId = res.VpcEndpoints[0].VpcEndpointId;

    this.serverless.cli.log('Plugin - Update Bucket Policy: My S3 VPC endpoint Id ' + vpcEId);

    var policyParams = {
      Bucket: bucketName,
      Policy:
        '{\"Version\":\"2008-10-17\",\"Statement\":[{\"Sid\":\"Access-to-specific-VPCE-only\",\"Effect\":\"Deny\",\"Principal\":\"*\",\"Action\":\"s3:*\",\"Resource\":\"' +bucketARN+ '\",\"Condition\":{\"StringNotEquals\":{\"aws:SourceVpce\":\"'+vpcEId+'\"}}}]}',
    };

    let policyRes = await S3.putBucketPolicy(policyParams).promise();

    this.serverless.cli.log('Plugin - Update Bucket Policy: S3 bucket policy applied.');
  }
}

module.exports = UpdateBucketPolicy;
