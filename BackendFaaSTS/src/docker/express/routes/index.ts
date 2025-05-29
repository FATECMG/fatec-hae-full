import { authRoutes } from '@docker/express/routes/auth'
import { usersRoutes } from '@docker/express/routes/user'
import { schoolsRoutes } from '@docker/express/routes/school'
import { rolesRoutes } from '@docker/express/routes/role'
import { projectsRoutes } from '@docker/express/routes/project'
import { noticesRoutes } from '@docker/express/routes/notice'
import { addressRoutes } from '@docker/express/routes/address'
import { commentsRoutes } from '@docker/express/routes/comment'
import { emailRoutes } from '@docker/express/routes/email'
import { courseRoutes } from '@docker/express/routes/course'
import { passwordValidationRoutes } from '@docker/express/routes/passwordvalidation'

import { Router, type Express } from 'express'

export const setupRoutes = (app: Express): void => {
  const router = Router()
  authRoutes(router)
  usersRoutes(router)
  schoolsRoutes(router)
  rolesRoutes(router)
  projectsRoutes(router)
  noticesRoutes(router)
  addressRoutes(router)
  commentsRoutes(router)
  emailRoutes(router)
  courseRoutes(router)
  passwordValidationRoutes(router)
  app.use('/api', router)
}
