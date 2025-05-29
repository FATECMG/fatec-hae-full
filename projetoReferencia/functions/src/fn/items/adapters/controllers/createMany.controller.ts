import 'reflect-metadata'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import { Locator } from '../../shared/di.enums'
import { ICreateManyItems } from '../../usecases/createMany.usecase'
import { IItemEntity } from '../../entities/item.entity'

@injectable()
export class CreateManyController implements Handler {
  constructor(@inject(Locator.CreateManyUseCase) usecase: ICreateManyItems) {
    this._usecase = usecase
  }
  readonly _usecase: ICreateManyItems

  async handle(req: Request): Promise<ResponseReturn> {
    const { items } = req.body
    items as IItemEntity[]

    const itemsCreated = await this._usecase.createManyItems(items)
    return { statusCode: 200, body: itemsCreated }
  }
}
