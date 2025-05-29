import { type Router } from 'express'
import {
  GetProjectHandler,
  GetAllProjectHandler,
  PostProjectHandler,
  PutProjectHandler,
  DeleteProjectHandler,
  PatchActivateProjectHandler,
  PatchDeactivateProjectHandler,
  PatchProjectStatusHandler,
  GetProjectsFromUserHandler
} from '@docker/express/routes/project/http/Handlers'
import { ProjectFilter } from '@functions/project/adapter/external/web/filter/ProjectFilter'

export const projectsRoutes = (router: Router): void => {
  router
    .route('/projects')
    .get((req, res) => {
      GetAllProjectHandler(ProjectFilter.create(req.query), req.headers.infotoken as string ?? '')
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
    .post((req, res) => {
      PostProjectHandler(req)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })

  router
    .route('/projects/:id')
    .get((req, res) => {
      GetProjectHandler(req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
    .delete((req, res) => {
      DeleteProjectHandler(req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
    .put((req, res) => {
      PutProjectHandler(req, req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })

  router.patch('/projects/:id/activate', (req, res) => {
    PatchActivateProjectHandler(req.params.id)
      .then(response => {
        res.status(response.statusCode).json(response.data)
      })
      .catch(error => {
        res.status(error.statusCode).json(error.message)
      })
  })

  router.patch('/projects/:id/deactivate', (req, res) => {
    PatchDeactivateProjectHandler(req.params.id)
      .then(response => {
        res.status(response.statusCode).json(response.data)
      })
      .catch(error => {
        res.status(error.statusCode).json(error.message)
      })
  })

  router.get('/users/:id/projects', (req, res) => {
    GetProjectsFromUserHandler(req.params.id)
      .then(response => {
        res.status(response.statusCode).json(response.data)
      })
      .catch(error => {
        res.status(error.statusCode).json(error.message)
      })
  })

  router.patch('/projects/:id/status', (req, res) => {
    PatchProjectStatusHandler(req.params.id, req.body.status, req.headers.infotoken as string ?? '')
      .then(response => {
        res.status(response.statusCode).json(response.data)
      })
      .catch(error => {
        res.status(error.statusCode).json(error.message)
      })
  })
}
