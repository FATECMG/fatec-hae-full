import { GetUserDataByTokenHandler, PostAuthHandler } from '@docker/express/routes/auth/http'

import { type Router } from 'express'

export const authRoutes = (router: Router): void => {
  router.post('/auth', (req, res) => {
    PostAuthHandler(req)
      .then((response) => {
        res.status(response.statusCode).json(response.data)
      })
      .catch((error) => {
        res.status(error.statusCode).json(error.message)
      })
  })

  router.post('/auth/user', (req, res) => {
    GetUserDataByTokenHandler(req)
      .then((response) => {
        res.status(response.statusCode).json(response.data)
      })
      .catch((error) => {
        res.status(error.statusCode).json(error.message)
      })
  })
}
