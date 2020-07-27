'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDoc = new AWS.DynamoDB.DocumentClient();


module.exports.update = async(event, context) => {
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
};

