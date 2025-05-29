import { inject, injectable } from 'inversify'
import { ResponseReturn } from '../../../../shared/adapters/controllers/interfaces'
import { IOrdersUseCase } from '../../usecases/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'

@injectable()
export class ChangeOrderItemStatusHttp {
  constructor(
    @inject(Locator.OrdersUseCase)
    private readonly ordersUseCase: IOrdersUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { order, orderItem } = req.params
    const { status } = req.body
    await this.ordersUseCase.changeOrderItemStatus(order, orderItem, status)
    return {
      statusCode: 200,
      body: {},
    }
  }
}
