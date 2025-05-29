import { type Router } from 'express'
import {
  GetCourseHandler,
  GetAllCourseHandler,
  PostCourseHandler,
  PutCourseHandler,
  DeleteCourseHandler,
  PatchActivateCourseHandler,
  PatchDeactivateCourseHandler,
  GetAllCourseNameAndIdHandler
} from '@docker/express/routes/course/http/Handlers'

export const courseRoutes = (router: Router): void => {
  router
    .route('/courses')
    .get((req, res) => {
      GetAllCourseHandler(req.query.active?.toString())
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
    .post((req, res) => {
      PostCourseHandler(req)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })

  router
    .route('/courses/:id')
    .get((req, res) => {
      GetCourseHandler(req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })

    .get((req, res) => {
      GetAllCourseNameAndIdHandler(req.query.active?.toString())
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })

    .delete((req, res) => {
      DeleteCourseHandler(req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
    .put((req, res) => {
      PutCourseHandler(req, req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })

  router.patch('/courses/:id/activate', (req, res) => {
    PatchActivateCourseHandler(req.params.id)
      .then(response => {
        res.status(response.statusCode).json(response.data)
      })
      .catch(error => {
        res.status(error.statusCode).json(error.message)
      })
  })

  router.patch('/courses/:id/deactivate', (req, res) => {
    PatchDeactivateCourseHandler(req.params.id)
      .then(response => {
        res.status(response.statusCode).json(response.data)
      })
      .catch(error => {
        res.status(error.statusCode).json(error.message)
      })
  })
}
