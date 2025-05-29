import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IBusinessUseCase } from '../../usecases/interfaces.usecases'
@injectable()
export class ListBusinessesHttp implements Handler {
  constructor(
    @inject(Locator.BusinessUseCase) private usecase: IBusinessUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { filters, projection, limit, offset, populate } = req.query
    let realLimit = parseInt(limit as string)
    realLimit = isNaN(realLimit) ? undefined : realLimit
    let realOffset = parseInt(offset as string)
    realOffset = isNaN(realOffset) ? undefined : realOffset

    const result = await this.usecase.list(
      filters,
      projection as string,
      realLimit,
      realOffset,
      populate,
    )
    return {
      statusCode: 200,
      body: result,
    }
  }
}
