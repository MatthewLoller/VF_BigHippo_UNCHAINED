'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDoc = new AWS.DynamoDB.DocumentClient();

module.exports.readAndCopy = async(event, context) => {
  let dynamoTableName = process.env.DYNAMODB_HIPPO_TABLE
    let sourceBucket = process.env.SOURCE_BUCKET_NAME
  
    let bucketParams = {
      Bucket: sourceBucket
    }
    
    let s3Objects

    // attempts to list all objects in S3 bucket
    try {
       s3Objects = await S3.listObjectsV2(bucketParams).promise();
       console.log(s3Objects)
    } catch (e) {
       console.log(e)
    }
  
    // create json string
    let s3ObjectsJSONString = JSON.stringify(s3Objects)

    // cw log
    console.log(s3ObjectsJSONString)

    // create json obj
    let s3JSON = JSON.parse(s3ObjectsJSONString)
    
    // cw log
    console.log('s3ObjectsJSONString',s3JSON.Contents[0])
    
    // fills getParams with bucket name and first object found in S3
    let getParams = {
      Bucket: sourceBucket,
      Key: s3JSON.Contents[0].Key
    };
    
    // get single s3 object
    let s3Obj = await S3.getObject(getParams).promise()

    // create json object from s3Obj
    let jsonS3Object = JSON.parse(s3Obj.Body.toString());
    
    // cw log
    console.log('here is my s3 object Im trying to upload', jsonS3Object)
    
    // builds object to send to dynamo
    var putParams = {
      TableName: dynamoTableName,
      Item: {
        id: jsonS3Object.id,
        name: jsonS3Object.name,
        species: jsonS3Object.species,
        location: jsonS3Object.location,
        food: jsonS3Object.food
      }
    };
    
    // attempts dynamo send
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient()
      let result = await dynamodb.put(putParams).promise()
      return {
        body: result
      }
    } catch (putError) {
      console.log(putError)
    }
};