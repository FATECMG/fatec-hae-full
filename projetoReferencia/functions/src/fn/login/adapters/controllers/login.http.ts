import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request, Response } from 'express'
import { Locator } from '../../shared/di.enums'
import { ILoginUseCase } from '../../usecases/interfaces'
import { validate } from '../../../../shared/decorators/validate'
import { ValidateLoginHttp } from './validations/login.http.validation'
import auth from 'basic-auth'
import { DomainError } from '../../../../shared/errors/domain.error'
@injectable()
export class LoginHttp implements Handler {
  constructor(@inject(Locator.LoginUseCase) private usecase: ILoginUseCase) {}

  @validate(new ValidateLoginHttp())
  async handle(req: Request, res: Response): Promise<ResponseReturn> {
    const credentials = auth(req)
    if (!credentials) {
      const error = new DomainError({
        message: 'missing credentials',
        errorCode: 'login-001',
      })
      error.statusCode = 401
      throw error
    }
    const result = await this.usecase.login({
      password: credentials.pass,
      email: credentials.name,
    })
    res.cookie('token', result.jwt, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 60 * 60 * 24 * 1 * 1000,
    })
    return { statusCode: 200, body: result }
  }
}
