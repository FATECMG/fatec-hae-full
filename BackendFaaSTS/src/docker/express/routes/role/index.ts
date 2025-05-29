import { type Router } from 'express'
import { GetAllRoleHandler } from '@docker/express/routes/role/http/Handlers'

export const rolesRoutes = (router: Router): void => {
  router
    .route('/roles')
    .get((_req, res) => {
      GetAllRoleHandler()
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
}
