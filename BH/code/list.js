'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDoc = new AWS.DynamoDB.DocumentClient();

module.exports.list = async(event, context) => {
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

};
