import { handlerPath } from '@libs/HandlerResolver'

const postAuth = {
  handler: `${handlerPath(__dirname)}/AuthHandler.postAuth`,
  events: [
    {
      http: {
        method: 'post',
        path: '/auth',
        cors: true
      }
    }
  ]
}

const getUserData = {
  handler: `${handlerPath(__dirname)}/AuthHandler.getUserData`,
  events: [
    {
      http: {
        method: 'post',
        path: '/auth/user',
        cors: true
      }
    }
  ]
}

export default {
  postAuth,
  getUserData
} as const
