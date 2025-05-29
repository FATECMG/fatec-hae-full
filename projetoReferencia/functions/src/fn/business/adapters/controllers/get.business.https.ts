import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import { Locator } from '../../shared/di.enums'
import { IBusinessUseCase } from '../../usecases/interfaces.usecases'

@injectable()
export class GetBusinessHttps implements Handler {
  constructor(
    @inject(Locator.BusinessUseCase) private usecase: IBusinessUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { id } = req.params
    const user = await this.usecase.getOne(id)

    return { statusCode: 200, body: user }
  }
}
