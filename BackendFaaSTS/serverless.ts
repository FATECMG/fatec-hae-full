import type { AWS } from '@serverless/typescript'
import Functions from '@functions/Functions'

import BucketResource from '@config/cloudformation/s3/BucketResource'
import CognitoResource from '@config/cloudformation/cognito/CognitoResource'

const serverlessConfiguration: AWS = {
  service: 'fatec-hae-service',
  app: 'fatec-hae',
  org: 'fatecmg',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'us-east-2',
    stage: "${opt:stage, 'dev'}",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      MONGO_URI: '${env:MONGO_URI}',
      MONGO_DB_NAME: '${env:MONGO_DB_NAME}',
      COGNITO_CLIENT_ID: '${env:COGNITO_CLIENT_ID}',
      COGNITO_USER_POOL_ID: '${env:COGNITO_USER_POOL_ID}',
      COGNITO_REGION: '${env:COGNITO_REGION}',
      COGNITO_CLIENT_SECRET: '${env:COGNITO_CLIENT_SECRET}',
      AWS_ACCESS: '${env:AWS_ACCESS}',
      AWS_SECRET: '${env:AWS_SECRET}',
      S3_BUCKET: '${env:S3_BUCKET}',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      AWS_ACCESS_COGNITO: '${env:AWS_ACCESS_COGNITO}',
      AWS_SECRET_COGNITO: '${env:AWS_SECRET_COGNITO}',
      AWS_REGION_COGNITO: '${env:AWS_REGION_COGNITO}',
    }
  },

  resources: {
    Resources: {
      ...CognitoResource,
      ...BucketResource
    }
  },

  // import the function via paths
  functions: { ...Functions },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    }
  }
}

module.exports = serverlessConfiguration