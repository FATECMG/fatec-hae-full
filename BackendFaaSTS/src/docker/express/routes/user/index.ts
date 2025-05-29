import { type Router } from 'express'
import {
  GetUserHandler,
  GetAllUserHandler,
  GetAllUserNameAndIdHandler,
  PostUserHandler,
  PutUserHandler,
  DeleteUserHandler,
  PatchActivateUserHandler,
  PatchDeactivateUserHandler
} from '@docker/express/routes/user/http/Handlers'

export const usersRoutes = (router: Router): void => {
  router
    .route('/users')
    .get((req, res) => {
      GetAllUserHandler(req.query.active?.toString())
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
    .post((req, res) => {
      PostUserHandler(req)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })

  router
    .route('/users/:id')
    .get((req, res) => {
      GetUserHandler(req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
    .delete((req, res) => {
      DeleteUserHandler(req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
    .put((req, res) => {
      PutUserHandler(req, req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })

  router.patch('/users/:id/activate', (req, res) => {
    PatchActivateUserHandler(req.params.id)
      .then(response => {
        res.status(response.statusCode).json(response.data)
      })
      .catch(error => {
        res.status(error.statusCode).json(error.message)
      })
  })

  router.patch('/users/:id/deactivate', (req, res) => {
    PatchDeactivateUserHandler(req.params.id)
      .then(response => {
        res.status(response.statusCode).json(response.data)
      })
      .catch(error => {
        res.status(error.statusCode).json(error.message)
      })
  })

  router.get('/users/name', (req, res) => {
    GetAllUserNameAndIdHandler(req.query.active?.toString())
      .then(response => {
        res.status(response.statusCode).json(response.data)
      })
      .catch(error => {
        res.status(error.statusCode).json(error.message)
      })
  })
}
