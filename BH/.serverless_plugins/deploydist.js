// Class: PSRunner
// Summary: Runs powershell script
class PSRunner {
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
      'after:deploy:finalize': () => Promise.resolve().then(this.runPowershell.bind(this))
    };
  }

  // Function: Run powershell
  // Summary: Run script to build and deploy SPA files to S3
  runPowershell() {
    this.serverless.cli.log('Plugin - Deploy: Running PowerShell');

    const { exec } = require('child_process');

    let path = this.serverless.service.custom.PSCOMMAND

    exec(path, {'shell':'powershell.exe'}, (error, stdout, stderr)=> {
        // do whatever with stdout
        
    })

    this.serverless.cli.log('Plugin - Deploy: PowerShell Complete');
  }
}

module.exports = PSRunner;
