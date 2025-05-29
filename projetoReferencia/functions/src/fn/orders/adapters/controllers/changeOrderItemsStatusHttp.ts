import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IOrdersUseCase } from '../../usecases/interfaces'

@injectable()
export class ChangeOrderItemsStatusHttp implements Handler {
  constructor(@inject(Locator.OrdersUseCase) private usecase: IOrdersUseCase) {}
  async handle(req: Request): Promise<ResponseReturn> {
    const { order: orderId } = req.params
    const { orderItemsIds, status } = req.body
    await this.usecase.changeOrderItemsStatus(orderId, orderItemsIds, status)
    return {
      statusCode: 200,
      body: {},
    }
  }
}
