import { handlerPath } from '@libs/HandlerResolver'

const postProject = {
  handler: `${handlerPath(__dirname)}/handlers/post.postProject`,
  events: [
    {
      http: {
        method: 'post',
        path: '/projects',
        cors: true
      }
    }
  ]
}

const getProject = {
  handler: `${handlerPath(__dirname)}/handlers/getOne.getProject`,
  events: [
    {
      http: {
        method: 'get',
        path: '/projects/{id}',
        cors: true
      }
    }
  ]
}

const getProjects = {
  handler: `${handlerPath(__dirname)}/handlers/getAll.getProjects`,
  events: [
    {
      http: {
        method: 'get',
        path: '/projects',
        cors: {
          origin: '*',
          headers: [
            'infotoken',
            'Authorization'
          ]
        },
        request: {
          parameters: {
            querystrings: {
              active: false,
              status: false
            }
          }
        }
      }
    }
  ]
}

const getProjectsFromUser = {
  handler: `${handlerPath(__dirname)}/handlers/FindAllFromUser.getProjectsFromUser`,
  events: [
    {
      http: {
        method: 'get',
        path: '/users/{id}/projects',
        cors: {
          origin: '*',
          headers: [
            'Authorization'
          ]
        }
      }
    }
  ]
}

const putProject = {
  handler: `${handlerPath(__dirname)}/handlers/Update.putProject`,
  events: [
    {
      http: {
        method: 'put',
        path: '/projects/{id}',
        cors: {
          origin: '*',
          headers: [
            'infotoken',
            'Authorization'
          ]
        }
      }
    }
  ]
}

const deleteProject = {
  handler: `${handlerPath(__dirname)}/handlers/Delete.deleteProject`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/projects/{id}',
        cors: true
      }
    }
  ]
}

const deactivateProject = {
  handler: `${handlerPath(__dirname)}/handlers/Deactivate.deactivateProject`,
  events: [
    {
      http: {
        method: 'patch',
        path: '/projects/{id}/deactivate',
        cors: true
      }
    }
  ]
}

const activateProject = {
  handler: `${handlerPath(__dirname)}/handlers/Activate.activateProject`,
  events: [
    {
      http: {
        method: 'patch',
        path: '/projects/{id}/activate',
        cors: true
      }
    }
  ]
}

const patchStatusProject = {
  handler: `${handlerPath(__dirname)}/handlers/UpdateProjectStatus.patchStatusProject`,
  events: [
    {
      http: {
        method: 'patch',
        path: '/projects/{id}/status',
        cors: {
          origin: '*',
          headers: [
            '*'
          ]
        }
      }
    }
  ]
}

export default {
  postProject,
  getProject,
  getProjects,
  putProject,
  deleteProject,
  deactivateProject,
  activateProject,
  patchStatusProject,
  getProjectsFromUser
} as const
