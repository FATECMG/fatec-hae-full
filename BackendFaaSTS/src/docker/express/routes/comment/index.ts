import { type Router } from 'express'
import {
  GetAllCommentHandler,
  PatchCreateCommentHandler
} from '@docker/express/routes/comment/http/Handlers'

export const commentsRoutes = (router: Router): void => {
  router
    .get('/projects/:id/comments', (req, res) => {
      GetAllCommentHandler(req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
    .patch('/projects/:id/comments', (req, res) => {
      PatchCreateCommentHandler(req.body, req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
}
