'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDoc = new AWS.DynamoDB.DocumentClient();

module.exports.delete = async(event, context) => {
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
};