import 'reflect-metadata'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import { Locator } from '../../shared/di.enums'
import { IListItems } from '../../usecases/list.usecase'

@injectable()
export class ListItemsController implements Handler {
  constructor(@inject(Locator.ListItemsUseCase) readonly usecase: IListItems) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { pagination, search, business }: any = req.query

    const data = await this.usecase.list({
      pagination: pagination
        ? {
            limit: parseInt(pagination?.limit as string),
            offset: parseInt(pagination?.offset as string),
          }
        : null,
      search: search as string,
      business: business as string,
    })
    return {
      statusCode: 200,
      body: data,
    }
  }
}
