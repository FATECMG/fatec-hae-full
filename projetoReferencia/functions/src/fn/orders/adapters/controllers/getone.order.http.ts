import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IOrdersUseCase } from '../../usecases/interfaces'
@injectable()
export class GetOneOrderHttp implements Handler {
  constructor(@inject(Locator.OrdersUseCase) private usecase: IOrdersUseCase) {}
  async handle(req: Request): Promise<ResponseReturn> {
    const { order } = req.params
    const { projection } = req.query
    const loadedOrder = await this.usecase.getOne(
      { _id: order },
      projection as string,
    )
    return {
      statusCode: 200,
      body: loadedOrder,
    }
  }
}
