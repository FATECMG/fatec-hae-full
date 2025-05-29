import { handlerPath } from '@libs/HandlerResolver'

const createComment = {
  handler: `${handlerPath(__dirname)}/handlers/CreateComment.createProjectComment`,
  events: [
    {
      http: {
        method: 'patch',
        path: '/projects/{id}/comments',
        cors: true
      }
    }
  ]
}

const getComments = {
  handler: `${handlerPath(__dirname)}/handlers/GetComments.getProjectComments`,
  events: [
    {
      http: {
        method: 'get',
        path: '/projects/{id}/comments',
        cors: true
      }
    }
  ]
}

export default {
  getComments,
  createComment
} as const
