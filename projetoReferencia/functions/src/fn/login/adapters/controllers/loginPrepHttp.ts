import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { ILoginUseCase } from '../../usecases/interfaces'
import { Request } from 'express'
import auth from 'basic-auth'

@injectable()
export class LoginPrepHttp implements Handler {
  constructor(@inject(Locator.LoginUseCase) private usecase: ILoginUseCase) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const cred = auth(req)
    const { episode } = req.body
    await this.usecase.loginPrep({
      password: cred.pass,
      episode: { _id: episode },
    })
    return {
      statusCode: 200,
      body: {},
    }
  }
}
