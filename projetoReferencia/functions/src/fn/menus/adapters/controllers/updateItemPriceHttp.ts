import { inject, injectable } from 'inversify'
import { Request } from 'express'
import { Handler } from '../../../../shared/adapters/controllers/interfaces'
import { IUpdateItemPriceUseCase } from '../../usecases/updateItemPriceUseCase'
import { Locator } from '../../shared/di.enums'

@injectable()
export class UpdateItemPriceHttp implements Handler {
  constructor(
    @inject(Locator.UpdateItemPriceUseCase)
    private useCase: IUpdateItemPriceUseCase,
  ) {}

  async handle(request: Request): Promise<any> {
    const { menu: menuId, itemPrice } = request.params

    const menu: any = {
      _id: menuId,
      itemsPrice: [{ _id: itemPrice, ...request.body }],
    }
    return {
      statusCode: 200,
      body: await this.useCase.updateItemPrice(menu),
    }
  }
}
