'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDoc = new AWS.DynamoDB.DocumentClient();

module.exports.create = async(event, context) => {
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

};

