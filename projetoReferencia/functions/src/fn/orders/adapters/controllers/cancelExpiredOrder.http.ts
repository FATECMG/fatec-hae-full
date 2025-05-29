import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IOrdersUseCase } from '../../usecases/interfaces'
@injectable()
export class CancelExpiredOrderHttp implements Handler {
  constructor(@inject(Locator.OrdersUseCase) private usecase: IOrdersUseCase) {}
  async handle(request: Request): Promise<ResponseReturn> {
    const { order } = request.params
    const canceledOrder = await this.usecase.cancelExpired({ _id: order })

    return {
      statusCode: 200,
      body: canceledOrder,
    }
  }
}
