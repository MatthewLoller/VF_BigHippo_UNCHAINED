'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDoc = new AWS.DynamoDB.DocumentClient();

module.exports.get = async(event, context) => {
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
};
