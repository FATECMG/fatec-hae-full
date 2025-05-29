import { setupMiddlewares } from '@docker/express/config/Middlewares'
import { setupRoutes } from '@docker/express/routes'

import { type Express } from 'express'
import express = require('express')

const app: Express = express()
setupMiddlewares(app)
setupRoutes(app)

export { app }
