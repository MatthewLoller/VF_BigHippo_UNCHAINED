'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDoc = new AWS.DynamoDB.DocumentClient();

module.exports = {
  readAndCopy: async(event, context) => {
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
    
    
  },
  create: async(event, context) => {
    let bodyObj = {}

    try {
      bodyObj = JSON.parse(event.body)
    } catch (jsonError) {
      console.log('there was an error', jsonError)
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }
      }
    }

    if (typeof bodyObj.id === 'undefined' || typeof bodyObj.name === 'undefined') {
      console.log('Missing parameters, id and name are required')
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }
      }
    }

    let putParams = {
      TableName: process.env.DYNAMODB_HIPPO_TABLE,
      Item: {
        id: bodyObj.id,
        name: bodyObj.name,
        food: bodyObj.food,
        location: bodyObj.location,
        species: bodyObj.species
      }
    }

    let putResult = {}

    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient()
      putResult = await dynamodb.put(putParams).promise()
    } catch(putError) {
      console.log('There was a problem putting the hippo')
      console.log('putParams: ', putParams)
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }
      }
    }

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      }      
    }
  },
  list: async(event, context) => {
    let scanParams = {
      TableName: process.env.DYNAMODB_HIPPO_TABLE
    }

    let scanResult = {}

    try { 
      let dynamodb = new AWS.DynamoDB.DocumentClient()
      scanResult = await dynamodb.scan(scanParams).promise()
    } catch (scanError) {
      console.log('there was an error')
      console.log(scanError)
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }
      }
    }

    if (scanResult.Items == null || !Array.isArray(scanResult.Items) || scanResult.Items.length == 0) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(scanResult.Items.map(hippo => {
        return {
          id: hippo.id,
          name: hippo.name,
          food: hippo.food,
          location: hippo.location,
          species: hippo.species
        }
      }))
    }
  },
  get: async(event, context) => {
    console.log(event)
    let getParams = {
      TableName: process.env.DYNAMODB_HIPPO_TABLE,
      Key: { 
        id: event.pathParameters.id
      }
    }
    let getResult = {}
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient()
      getResult = await dynamodb.get(getParams).promise()
    } catch (scanError) {
      console.log('there was an error')
      console.log(scanError)
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }
      }
    }

    if (getResult.Item == null) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }
      }
    }

    console.log('my result', getResult)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        id: getResult.Item.id,
        name: getResult.Item.name,
        food: getResult.Item.food,
        location: getResult.Item.location,
        species: getResult.Item.species
      })
    }
  },
  update: async(event, context) => {
    let bodyObj = {}

    try {
      bodyObj = JSON.parse(event.body)
    } catch (jsonError) {
      console.log('there was an error', jsonError)
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }
      }
    }

    if (typeof bodyObj.name == 'undefined') {
      console.log('missing parameters')
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }
      }
    }

    let updateParams = {
      TableName: process.env.DYNAMODB_HIPPO_TABLE,
      Key: { 
        id: event.pathParameters.id
      },
      UpdateExpression: 'SET #name = :name, #location = :location, #food = :food, #species = :species',
      ExpressionAttributeNames: {
        '#name':'name',
        '#location':'location',
        '#food':'food',
        '#species':'species',
      },
      ExpressionAttributeValues: {
        ':name': bodyObj.name,
        ':location': bodyObj.location,
        ':food': bodyObj.food,
        ':species': bodyObj.species,
      },
      ReturnValues: 'UPDATED_NEW'
    }

    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient()
      let res = await dynamodb.update(updateParams).promise()
    } catch (updateError) {
      console.log('there was an error')
      console.log(updateError)
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      }
    }
  },
  delete: async(event, context) => {
    let deleteParams = {
      TableName: process.env.DYNAMODB_HIPPO_TABLE,
      Key: { 
        id: event.pathParameters.id
      }
    }
    let deleteResult = {}
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient()
      deleteResult = await dynamodb.delete(deleteParams).promise()
      console.log(deleteResult)
    } catch (deleteError) {
      console.log('there was an error')
      console.log(deleteError)
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      }
    }
  }
}



