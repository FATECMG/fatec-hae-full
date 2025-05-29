import { handlerPath } from '@libs/HandlerResolver'

const getSchool = {
  handler: `${handlerPath(__dirname)}/handlers/GetOne.getSchool`,
  events: [
    {
      http: {
        method: 'get',
        path: '/schools/{id}',
        cors: true
      }
    }
  ]
}

const getSchools = {
  handler: `${handlerPath(__dirname)}/handlers/GetAll.getSchools`,
  events: [
    {
      http: {
        method: 'get',
        path: '/schools',
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

const postSchool = {
  handler: `${handlerPath(__dirname)}/handlers/Post.postSchool`,
  events: [
    {
      http: {
        method: 'post',
        path: '/schools',
        cors: true
      }
    }
  ]
}

const deleteSchool = {
  handler: `${handlerPath(__dirname)}/handlers/Delete.deleteSchool`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/schools/{id}',
        cors: true
      }
    }
  ]
}

const deactivateSchool = {
  handler: `${handlerPath(__dirname)}/handlers/Deactivate.deactivateSchool`,
  events: [
    {
      http: {
        method: 'patch',
        path: '/schools/{id}/deactivate',
        cors: true
      }
    }
  ]
}

const activateSchool = {
  handler: `${handlerPath(__dirname)}/handlers/Activate.activateSchool`,
  events: [
    {
      http: {
        method: 'patch',
        path: '/schools/{id}/activate',
        cors: true
      }
    }
  ]
}

const putSchool = {
  handler: `${handlerPath(__dirname)}/handlers/Update.putSchool`,
  events: [
    {
      http: {
        method: 'put',
        path: '/schools/{id}',
        cors: true
      }
    }
  ]
}

export default {
  getSchool,
  getSchools,
  postSchool,
  deleteSchool,
  putSchool,
  deactivateSchool,
  activateSchool
} as const
