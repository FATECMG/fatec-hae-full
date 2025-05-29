import 'reflect-metadata'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import { Locator } from '../../shared/di.enums'
import { ICreateCompleteItem } from '../../usecases/createCompleteItem.usecase'

@injectable()
export class CreateCompleteItemController implements Handler {
  constructor(
    @inject(Locator.CreateCompleteItemUseCase)
    readonly usecase: ICreateCompleteItem,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const body = req.body
    const item = await this.usecase.createCompleteItem(body)
    return { statusCode: 200, body: item }
  }
}
