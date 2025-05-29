import * as AWS from 'aws-sdk'

const dynamodbClient = new AWS.DynamoDB.DocumentClient({
  region: 'sa-east-1'
})

export default dynamodbClient
