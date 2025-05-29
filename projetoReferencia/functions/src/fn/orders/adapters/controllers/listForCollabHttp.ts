import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IOrdersUseCase } from '../../usecases/interfaces'
import { validate } from '../../../../shared/decorators/validate'
import { ListForCollabHttpValidation } from './validations/listForCollabHttpValidation'

@injectable()
export class ListForCollabHttp implements Handler {
  constructor(@inject(Locator.OrdersUseCase) private usecase: IOrdersUseCase) {}

  @validate(new ListForCollabHttpValidation())
  async handle(req: Request): Promise<ResponseReturn> {
    const { episode, status } = req.query
    const orders = await this.usecase.listForCollab({
      episode: { _id: episode },
      status: status as string,
    })
    return {
      statusCode: 200,
      body: orders,
    }
  }
}
