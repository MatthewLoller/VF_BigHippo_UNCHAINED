const AWS = require('aws-sdk');
const Lambda = new AWS.Lambda({region: 'us-east-1'});

// Class: LambdaInvoker
// Summary: Prepares lifecycle hooks and commands for plugin
class LambdaInvoker {
  constructor(serverless, options) {

    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('aws');

    this.commands = {
      s3deploy: {
        usage: 'Deploy assets to S3 bucket',
        lifecycleEvents: [
          'deploy'
        ]
      }
    };

    this.hooks = {
      'after:deploy:finalize': () => Promise.resolve().then(this.seedAndInvoke.bind(this))
    };
  }

  // Function: seedAndInvoke
  // Summary: Invokes Lambda function
  seedAndInvoke() {  

    this.serverless.cli.log('Plugin - S3 to Dynamo: Running Lambda Invoker');

    let functionName = this.serverless.service.custom.READANDCOPY_FUNCTION_NAME

    var params = {
      FunctionName: functionName
    };

    this.serverless.cli.log('Plugin - S3 to Dynamo: Invoking ' +functionName);
     
    Lambda.invoke(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });

    this.serverless.cli.log('Plugin - S3 to Dynamo: ' +functionName+ ' invoked');
  }
}

module.exports = LambdaInvoker;
