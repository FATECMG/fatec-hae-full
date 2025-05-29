import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IItemUseCase } from '../../usecases/interfaces'
@injectable()
export class GetItemHttp implements Handler {
  constructor(@inject(Locator.ItemUseCase) private usecase: IItemUseCase) {}
  async handle(req: Request): Promise<ResponseReturn> {
    const { item } = req.params
    const loadedItem = await this.usecase.getItem(item)
    return {
      statusCode: 200,
      body: loadedItem,
    }
  }
}
