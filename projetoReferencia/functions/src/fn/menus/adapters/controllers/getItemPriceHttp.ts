import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import { Locator } from '../../shared/di.enums'
import { IGetItemPriceUseCase } from '../../usecases/getItemPriceUseCase'

@injectable()
export class GetItemPriceHttp implements Handler {
  constructor(
    @inject(Locator.GetItemPriceUseCase) private usecase: IGetItemPriceUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { itemPriceId } = req.params
    const { filters } = req.query
    const itemPrice = await this.usecase.getItemPrice(itemPriceId, filters)
    return {
      statusCode: 200,
      body: itemPrice,
    }
  }
}
