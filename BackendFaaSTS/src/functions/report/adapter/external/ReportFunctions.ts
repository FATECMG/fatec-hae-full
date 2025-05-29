import { handlerPath } from '@libs/HandlerResolver'

const postReport = {
  handler: `${handlerPath(__dirname)}/handlers/Post.postReport`,
  events: [
    {
      http: {
        method: 'post',
        path: '/reports',
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

const putReport = {
  handler: `${handlerPath(__dirname)}/handlers/UpdateReport.putReport`,
  events: [
    {
      http: {
        method: 'put',
        path: '/reports',
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

const getAllReports = {
  handler: `${handlerPath(__dirname)}/handlers/GetAllExistingNonDraftReports.getAllReports`,
  events: [
    {
      http: {
        method: 'get',
        path: '/reports',
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

const getAllReportsByAuthor = {
  handler: `${handlerPath(__dirname)}/handlers/GetAllExistingByAuthorReports.getAllReports`,
  events: [
    {
      http: {
        method: 'get',
        path: '/reports/author',
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

const patchStatusReport = {
  handler: `${handlerPath(__dirname)}/handlers/UpdateReportStatus.patchStatusReport`,
  events: [
    {
      http: {
        method: 'patch',
        path: '/reports/{id}/status',
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

const deleteReport = {
  handler: `${handlerPath(__dirname)}/handlers/DeleteReport.deleteReport`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/reports/{id}',
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
  postReport,
  getAllReports,
  getAllReportsByAuthor,
  patchStatusReport,
  deleteReport,
  putReport
} as const
