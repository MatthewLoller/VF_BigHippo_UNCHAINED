# BigHippo goes #Severless with VoiceFoundry

![Imgur](https://i.imgur.com/cu29his.png)

## Table of Contents
-   [Description](#description)
-   [Diagrams](#diagrams)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Verification](#verification)
-   [RoadMap](#roadmap)
-   [DiscussionItems](#discussionitems)
-   [ProjectStatus](#projectstatus)
-   [WorksCited](#workscited)


## Description
This EPIC version of the BigHippo Serverless project fulfills the MVP of Building a Serverless Plugin triggered Lambda function to read an object from S3 and write into a Dynamo table. This version also deploys an Hippo Manager Angular application to S3, served by Cloudfront. There was an extra Plugin created to run a PowerShell script that builds the node_modules and project, writes a new API gateway endpoint to the environment.{stage}.ts file, and deploys published files to S3. Ontop of deploying the app, there is an extra Lambda function in there triggered by an S3 event to add a CloudFront Invalidation. API Gateway is configured to serve a whole set of RESTful CRUD endpoints which serves data to the Angular Web Application. The Angular Web App has a quick dashboard and table to perform CRUD operations. I think thats it...
## Diagrams

### MVP CloudFormation Resources
![Imgur](https://i.imgur.com/ff7UZzq.png)
### MVP Flow
![Imgur](https://i.imgur.com/2Gxy8PX.png)
### Epic End User Flow
![Imgur](https://i.imgur.com/P30iyfg.png)
### Epic CloudFormation Resources
![Imgur](https://i.imgur.com/hjCbjbu.png)
### Epic Post Resource Creation
![Imgur](https://i.imgur.com/pvgVbU9.png)

## Prerequisites
- Must be able to run PowerShell scripts, You not only must have powershell, but you must have the ability to run the script. If having access issues, open up Powershell as Admin and run the following command.
```sh
$ Set-ExecutionPolicy Unrestricted
```
- Must have an AWS account with programatic access, we will be running scripts that require this!
- Must have an appriciation for the Hippopotamus amphibius (Hippo), if you don't, this demo wont work for you, the stack KNOWS.
- Must not be afraid of the command line, I've done as much as I can, however you might have to troubleshoot on your end while configuring your environment
- Must have a passion to learn cool new things. Have Fun!

## Installation

1) Have AWS account with appropriate permissons, Admin access should be appropriate (Not root)
2) Generate AWS Credentials (Access Keys) - https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey
3) Install AWS CLI - https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
4) Configure AWS credentials - https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
5) Install node.js - https://nodejs.org/en/download/
6) Install Serverless Framework 
```sh
$ npm install -g serverless
```
7) Test Install by simply typing in 'serverless' or 'sls' 
```sh
$ sls
```
8) Install Angular CLI at this time Im using v9.1.1
```sh
$ npm install -g @angular/cli
```
9) Test Install of Angular CLI
```sh
$ ng --version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/

Angular CLI: 9.1.1
Node: 12.16.1
OS: win32 x64
```
10) Clone repository
```sh
$ git clone https://github.com/MatthewLoller/VF_BigHippo_Epic.git
```
11) Navigate to repository.
12) Run 'npm install' to bring in packages.
```sh
$ npm install
```
13) Navigate to /BH
```sh
$ cd bh 
```
14) Update the 'service' variable in the BH/serverless.yml file to something unique! (this will be your stack name, it is also used in naming other resources)
```sh
11:
12: service: epic-vf-bighippo-{something unique}
13: 
```
15) Open the repository either in command-line or text-editor w/console (I.E. VSCode)
16) Run Command to Deploy Stack with the profile name you configured for you AWS account.
```sh
$ serverless deploy --{your-profile-name}
```
15) Wait several minutes for your stack to deploy and watch the magic.

## Verification
Post Deploy verification steps

1) Verify DynamoDB object creation.
![Imgur](https://i.imgur.com/mMIXoou.png)
2) Locate CloudFront Outputs for your newly created stack, right click the CFDistribution url to open in a new tab.
![Imgur](https://i.imgur.com/jdzpq3E.png?1)
3) Verify Dashboard data is correct, At this point there should be 1 record in the system.
![Imgur](https://i.imgur.com/AjvYgyK.png)
4) Navigate to the Hippo Manager screen using the link on the sidebar, Verify Table data coresponds with what displays in Dynamo.
![Imgur](https://i.imgur.com/BedQn5q.png)
5) Test some CRUD operations! The data table supports inline editing, you are also able to create new rows in the table with the green '+' mark at the top right. The data is written to Dynamo after the Save button is pressed.
![Imgur](https://i.imgur.com/2QehY5D.png)
6) Verify Data is updated in Dynamo.
![Imgur](https://i.imgur.com/JUeTsk8.png)

ALTERNATIVE WAY TO VERIFY DYNAMO!!!
Snag the GET - https://{APIGATEWAYUID}.execute-api.us-east-1.amazonaws.com/dev/v1/hippos endpoint from the deploy result and Curl it


## RoadMap
Things I havent gotten to yet:
1) Single handler.js - I doubt having a single handler is the best way to build out multiple functions...
2) More robust error handling throughout
3) Unit/Integration Testing, Jest? Dynamo mocking?
4) Storing environment variables in parameter store, ref from lambda
5) Creating VPC for lambda functions
6) Creating VPC endpoint for Dynamo
7) Creating VPC endpoint for S3
8) Securing bucket policy to only allow request from potential VPC endpoint
9) Possible better way to store AWS credentials? Since we're running the deploy command locally its not a huge deal...

Potential Items:
1) CI/CD from GitHub repo, for this to work with VF, VF provides R53 HostedZone information. Also left this behind currently to make the deploy run without a hitch.

## DiscussionItems
- Discuss multiple ways to get File into S3
    - Lambda invoked by custom resource (chosen)
    - Powershell script to cp local file to s3
    - Plugin to write JSON to file and put

## ProjectStatus
Slow after submittal, will use as refrence matieral for some other projects in the works...

## WorksCited
- DOCS:
    - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/_index.html
    - https://www.serverless.com/framework/docs

- BLOGS & READMES:
    - AWS Lambda Environment Variables - Ryan S. Brown https://serverlesscode.com/post/env-vars-support-lambda/
        - Helped with understanding env variable syntax for lambda function in Serverless Framework
    - https://gist.github.com/HyperBrain/50d38027a8f57778d5b0f135d80ea406 - HyperBrain
    - https://www.serverless.com/blog/writing-serverless-plugins - Anna Doubkova
        - Help with building first plugin
    - https://medium.com/@danismaz.furkan/aws-cloudformation-defining-lambda-backed-custom-resources-ea5d6a353cbc - Furkan    -Danismaz
        - Refresher on custom lambda backed resources
    - https://medium.com/pablo-perez/ -how-can-i-avoid-waiting-for-one-hour-if-my-custom-resource-lambda-function-fails-to-execute-b1e17fe6de25 - Pablo Perez
        - This thing is always annoying to forget about
    - https://www.serverless.com/blog/serverless-test-framework
        - Unit testing
    - https://www.serverless.com/blog/unit-testing-nodejs-serverless-jest
        - Unit testing
    - https://www.serverless.com/blog/cors-api-gateway-survival-guide - Alex DeBrie
        - CORS 

- CODE:
    - https://stackoverflow.com/questions/53480547/upload-json-file-to-aws-s3-bucket-from-aws-sdk-in-node-js - Create JSON file from JS object - No longer used in implementation
    - https://stackoverflow.com/questions/51803582/aws-s3-listobjects-in-node-js-lambda-function - Example of S3 list objects

- YOUTUBE:
    - https://www.youtube.com/watch?v=LXB2Nv9ygQc&t=2971s - Webinar - Getting started with the serverless framework
