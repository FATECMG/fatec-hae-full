import { type Router } from 'express'
import {
  GetSchoolHandler,
  GetAllSchoolHandler,
  PostSchoolHandler,
  PutSchoolHandler,
  DeleteSchoolHandler,
  PatchActivateSchoolHandler,
  PatchDeactivateSchoolHandler
} from '@docker/express/routes/school/http/Handlers'

export const schoolsRoutes = (router: Router): void => {
  router
    .route('/schools')
    .get((req, res) => {
      GetAllSchoolHandler(req.query.active?.toString())
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
    .post((req, res) => {
      PostSchoolHandler(req)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })

  router
    .route('/schools/:id')
    .get((req, res) => {
      GetSchoolHandler(req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
    .delete((req, res) => {
      DeleteSchoolHandler(req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
    .put((req, res) => {
      PutSchoolHandler(req, req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })

  router.patch('/schools/:id/activate', (req, res) => {
    PatchActivateSchoolHandler(req.params.id)
      .then(response => {
        res.status(response.statusCode).json(response.data)
      })
      .catch(error => {
        res.status(error.statusCode).json(error.message)
      })
  })

  router.patch('/schools/:id/deactivate', (req, res) => {
    PatchDeactivateSchoolHandler(req.params.id)
      .then(response => {
        res.status(response.statusCode).json(response.data)
      })
      .catch(error => {
        res.status(error.statusCode).json(error.message)
      })
  })
}
