import { type Router } from 'express'
import {
  GetNoticeHandler,
  GetAllNoticeHandler,
  GetAllNoticeTitleAndIdHandler,
  GetNoticeTopicsOfInterestHandler,
  PostNoticeHandler,
  PutProjectHandler,
  DeleteNoticeHandler,
  PatchActivateNoticeHandler,
  PatchDeactivateNoticeHandler
} from '@docker/express/routes/notice/http/Handlers'

export const noticesRoutes = (router: Router): void => {
  router
    .route('/notices')
    .get((req, res) => {
      GetAllNoticeHandler(req.query.active?.toString())
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
    .post((req, res) => {
      PostNoticeHandler(req)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })

  router
    .route('/notices/:id')
    .get((req, res) => {
      GetNoticeHandler(req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
    .delete((req, res) => {
      DeleteNoticeHandler(req.params.id)
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

  router.patch('/notices/:id/activate', (req, res) => {
    PatchActivateNoticeHandler(req.params.id)
      .then(response => {
        res.status(response.statusCode).json(response.data)
      })
      .catch(error => {
        res.status(error.statusCode).json(error.message)
      })
  })

  router.patch('/notices/:id/deactivate', (req, res) => {
    PatchDeactivateNoticeHandler(req.params.id)
      .then(response => {
        res.status(response.statusCode).json(response.data)
      })
      .catch(error => {
        res.status(error.statusCode).json(error.message)
      })
  })

  router.get('/notices/:id/topics', (req, res) => {
    GetNoticeTopicsOfInterestHandler(req.params.id)
      .then(response => {
        res.status(response.statusCode).json(response.data)
      })
      .catch(error => {
        res.status(error.statusCode).json(error.message)
      })
  })

  router.get('/notices/title', (_req, res) => {
    GetAllNoticeTitleAndIdHandler()
      .then(response => {
        res.status(response.statusCode).json(response.data)
      })
      .catch(error => {
        res.status(error.statusCode).json(error.message)
      })
  })
}
