import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IOrdersUseCase } from '../../usecases/interfaces'

@injectable()
export class CreateOrderHttp implements Handler {
  constructor(
    @inject(Locator.OrdersUseCase) private ordersUseCase: IOrdersUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const order = req.body

    const createdOrder = await this.ordersUseCase.createOrder(order)

    return {
      statusCode: 200,
      body: createdOrder,
    }
  }
}
