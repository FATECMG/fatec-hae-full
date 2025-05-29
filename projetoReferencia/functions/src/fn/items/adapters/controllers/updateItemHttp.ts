import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { IItemUseCase } from '../../usecases/interfaces'
import { Locator } from '../../shared/di.enums'

@injectable()
export class UpdateItemHttp implements Handler {
  constructor(@inject(Locator.ItemUseCase) private itemUseCase: IItemUseCase) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { item: _id } = req.params
    const item = req.body
    const updatedItem = await this.itemUseCase.updateItem({ ...item, _id })
    return {
      statusCode: 200,
      body: updatedItem,
    }
  }
}
