import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IOrdersUseCase } from '../../usecases/interfaces'
@injectable()
export class ListForBusinessHttp implements Handler {
  constructor(@inject(Locator.OrdersUseCase) private usecase: IOrdersUseCase) {}
  async handle(req: Request): Promise<ResponseReturn> {
    const { filter, episode } = req.query
    const listing = await this.usecase.listForBusiness(
      {
        episode: { _id: episode },
      },
      filter,
    )
    return {
      statusCode: 200,
      body: listing,
    }
  }
}
