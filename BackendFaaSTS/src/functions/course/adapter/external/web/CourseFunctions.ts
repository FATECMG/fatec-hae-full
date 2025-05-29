import { handlerPath } from '@libs/HandlerResolver'

const postCourse = {
  handler: `${handlerPath(__dirname)}/CourseHandler.postCourse`,
  events: [
    {
      http: {
        method: 'post',
        path: '/courses',
        cors: true
      }
    }
  ]
}

const getCourses = {
  handler: `${handlerPath(__dirname)}/CourseHandler.getCourses`,
  events: [
    {
      http: {
        method: 'get',
        path: '/courses',
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

const getCourseNameAndIdHandler = {
  handler: `${handlerPath(__dirname)}/CourseHandler.getCourseNameAndId`,
  events: [
    {
      http: {
        method: 'get',
        path: '/courses/name',
        cors: true
      }
    }
  ]
}

const getCourse = {
  handler: `${handlerPath(__dirname)}/CourseHandler.getCourse`,
  events: [
    {
      http: {
        method: 'get',
        path: '/courses/{id}',
        cors: true
      }
    }
  ]
}

const deleteCourse = {
  handler: `${handlerPath(__dirname)}/CourseHandler.deleteCourse`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/courses/{id}',
        cors: true
      }
    }
  ]
}

const deactivateCourse = {
  handler: `${handlerPath(__dirname)}/CourseHandler.deactivateCourse`,
  events: [
    {
      http: {
        method: 'patch',
        path: '/courses/{id}/deactivate',
        cors: true
      }
    }
  ]
}

const activateCourse = {
  handler: `${handlerPath(__dirname)}/CourseHandler.activateCourse`,
  events: [
    {
      http: {
        method: 'patch',
        path: '/courses/{id}/activate',
        cors: true
      }
    }
  ]
}

const putCourse = {
  handler: `${handlerPath(__dirname)}/CourseHandler.putCourse`,
  events: [
    {
      http: {
        method: 'put',
        path: '/courses/{id}',
        cors: true
      }
    }
  ]
}

export default {
  getCourses,
  getCourse,
  putCourse,
  deleteCourse,
  postCourse,
  deactivateCourse,
  activateCourse,
  getCourseNameAndIdHandler
} as const
