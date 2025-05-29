import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import auth from 'basic-auth'
import { DomainError } from '../../../../shared/errors/domain.error'
import { validate } from '../../../../shared/decorators/validate'
import { ValidateLoginHttp } from './validations/login.http.validation'
import { Locator } from '../../shared/di.enums'
import { ILoginUseCase } from '../../usecases/interfaces'
import { IEpisode } from '../../../episodes/entities/interfaces'

@injectable()
export class LoginCollaboratorHttp implements Handler {
  constructor(@inject(Locator.LoginUseCase) private usecase: ILoginUseCase) {}

  @validate(new ValidateLoginHttp())
  async handle(req: Request): Promise<ResponseReturn> {
    const credentials = auth(req)
    if (!credentials) {
      const error = new DomainError({
        message: 'missing credentials',
        errorCode: 'login-001',
      })
      error.statusCode = 401
      throw error
    }

    const { episode } = req.body

    const collaborator = await this.usecase.loginCollab({
      email: credentials.name,
      password: credentials.pass,
      episode: episode as IEpisode,
    })

    return {
      statusCode: 200,
      body: collaborator,
    }
  }
}
