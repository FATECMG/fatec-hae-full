import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { IBusinessUseCase } from '../../usecases/interfaces.usecases'
import { Request } from 'express'

@injectable()
export class CheckBusinessEmailHttp implements Handler {
  constructor(
    @inject(Locator.BusinessUseCase) private usecase: IBusinessUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { email } = req.params
    const result = await this.usecase.checkEmail(email)
    return {
      statusCode: 200,
      body: {
        valid: !result,
      },
    }
  }
}
