import { handlerPath } from '@libs/HandlerResolver'

const postUser = {
  handler: `${handlerPath(__dirname)}/UserHandler.postUser`,
  events: [
    {
      http: {
        method: 'post',
        path: '/users',
        cors: true
      }
    }
  ]
}

const getUser = {
  handler: `${handlerPath(__dirname)}/UserHandler.getUser`,
  events: [
    {
      http: {
        method: 'get',
        path: '/users/{id}',
        cors: true
      }
    }
  ]
}

const getUsers = {
  handler: `${handlerPath(__dirname)}/UserHandler.getUsers`,
  events: [
    {
      http: {
        method: 'get',
        path: '/users',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              active: false
            }
          }
        }
      }
    }
  ]
}

const getUsersNameAndId = {
  handler: `${handlerPath(__dirname)}/UserHandler.getUsersNameAndId`,
  events: [
    {
      http: {
        method: 'get',
        path: '/users/name/',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              active: false
            }
          }
        }
      }
    }
  ]
}

const deleteUser = {
  handler: `${handlerPath(__dirname)}/UserHandler.deleteUser`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/users/{id}',
        cors: true
      }
    }
  ]
}

const activateUser = {
  handler: `${handlerPath(__dirname)}/UserHandler.activateUser`,
  events: [
    {
      http: {
        method: 'patch',
        path: '/users/{id}/activate',
        cors: true
      }
    }
  ]
}

const deactivateUser = {
  handler: `${handlerPath(__dirname)}/UserHandler.deactivateUser`,
  events: [
    {
      http: {
        method: 'patch',
        path: '/users/{id}/deactivate',
        cors: true
      }
    }
  ]
}

const putUser = {
  handler: `${handlerPath(__dirname)}/UserHandler.putUser`,
  events: [
    {
      http: {
        method: 'put',
        path: '/users/{id}',
        cors: true
      }
    }
  ]
}

export default {
  postUser,
  getUser,
  getUsers,
  deleteUser,
  putUser,
  activateUser,
  deactivateUser,
  getUsersNameAndId
} as const
