import { type Router } from 'express'
import { GetPoliciesHandler } from './http/GetPolicies'
import { PasswordValidationHandler } from './http/Validation'

export const passwordValidationRoutes = (router: Router): void => {
  router
    .route('/passwordvalidation/policies')
    .get((req, res) => {
      GetPoliciesHandler()
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })

  router
    .route('/passwordvalidation')
    .post((req, res) => {
      PasswordValidationHandler(req)
        .then(response => {
          res.status(response.statusCode).json(response.data)
        })
        .catch(error => {
          res.status(error.statusCode).json(error.message)
        })
    })
}
