import { type Router } from 'express'
import { GetAllAddressHandler } from '@docker/express/routes/address/http/Handlers'

export const addressRoutes = (router: Router): void => {
  router
    .route('/address/:id')
    .get((req, res) => {
      GetAllAddressHandler(req.params.id)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
}
