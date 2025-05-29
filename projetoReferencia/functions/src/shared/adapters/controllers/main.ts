import { Main, Handler, ResponseReturn } from './interfaces'
import { DomainError } from '../../errors/domain.error'
import { logger } from 'firebase-functions'

const main: Main = (service: Handler) => {
  return async (req, res) => {
    let response: ResponseReturn
    try {
      response = await service.handle(req, res)
    } catch (err) {
      if (err instanceof DomainError) {
        response = {
          statusCode: err.statusCode,
          body: { errorCode: err.errorCode, message: err.message },
        }
      } else {
        response = {
          statusCode: 500,
          body: { errorCode: 'unknown', message: err.message },
        }
      }
      logger.error(err)
    }
    res.status(response.statusCode).json(response.body)
  }
}

export default main
