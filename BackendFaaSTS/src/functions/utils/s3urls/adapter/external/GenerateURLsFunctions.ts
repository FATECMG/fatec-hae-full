import { handlerPath } from '@libs/HandlerResolver'

const getPreSignedPostURL = {
  handler: `${handlerPath(__dirname)}/handlers/GeneratePostUrlHandler.getPreSignedPostURL`,
  events: [
    {
      http: {
        method: 'post',
        path: '/reports/attachment',
        cors: true
      }
    }
  ]
}

const getPreSignedGetURL = {
  handler: `${handlerPath(__dirname)}/handlers/GenerateGetUrlHandler.getPreSignedGetURL`,
  events: [
    {
      http: {
        method: 'get',
        path: '/reports/attachment',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              resourceId: true,
              resourceType: true
            }
          }
        }
      }
    }
  ]
}

export default {
  getPreSignedPostURL,
  getPreSignedGetURL
} as const
