import { handlerPath } from '@libs/HandlerResolver'

const postNotice = {
  handler: `${handlerPath(__dirname)}/handlers/Save.postNotice`,
  events: [
    {
      http: {
        method: 'post',
        path: '/notices',
        cors: true
      }
    }
  ]
}

const putNotice = {
  handler: `${handlerPath(__dirname)}/handlers/Update.putNotice`,
  events: [
    {
      http: {
        method: 'put',
        path: '/notices/{id}',
        cors: true
      }
    }
  ]
}

const getNotice = {
  handler: `${handlerPath(__dirname)}/handlers/FindOne.getNotice`,
  events: [
    {
      http: {
        method: 'get',
        path: '/notices/{id}',
        cors: true
      }
    }
  ]
}

const getNotices = {
  handler: `${handlerPath(__dirname)}/handlers/FindAll.getNotices`,
  events: [
    {
      http: {
        method: 'get',
        path: '/notices',
        cors: {
          origin: '*',
          headers: [
            'infotoken',
            'Authorization'
          ]
        },
      }
    }
  ]
}

const getNoticeTopicsOfInterest = {
  handler: `${handlerPath(__dirname)}/handlers/FindTopicsOfInterestByNoticeId.getNoticeTopicsOfInterest`,
  events: [
    {
      http: {
        method: 'get',
        path: '/notices/{id}/topics',
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

const getNoticesTitleAndId = {
  handler: `${handlerPath(__dirname)}/handlers/FindAllNoticeTitleAndId.getNoticesTitleAndId`,
  events: [
    {
      http: {
        method: 'get',
        path: '/notices/title',
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

const deleteNotice = {
  handler: `${handlerPath(__dirname)}/handlers/DeleteOne.deleteNotice`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/notices/{id}',
        cors: true
      }
    }
  ]
}

const activateNotice = {
  handler: `${handlerPath(__dirname)}/handlers/Activate.activateNotice`,
  events: [
    {
      http: {
        method: 'patch',
        path: '/notices/{id}/activate',
        cors: true
      }
    }
  ]
}

const deactivateNotice = {
  handler: `${handlerPath(__dirname)}/handlers/Deactivate.deactivateNotice`,
  events: [
    {
      http: {
        method: 'patch',
        path: '/notices/{id}/deactivate',
        cors: true
      }
    }
  ]
}

export default {
  postNotice,
  putNotice,
  getNotice,
  getNotices,
  deleteNotice,
  activateNotice,
  deactivateNotice,
  getNoticeTopicsOfInterest,
  getNoticesTitleAndId
}
