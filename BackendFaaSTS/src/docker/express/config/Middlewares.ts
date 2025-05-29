import cors = require('cors')
import { type Express } from 'express'
import { json } from 'express'

export const setupMiddlewares = (app: Express): void => {
  app.use(cors())
  app.use(json())
  app.use((_req, res, next) => {
    res.type('json')
    next()
  })
}
