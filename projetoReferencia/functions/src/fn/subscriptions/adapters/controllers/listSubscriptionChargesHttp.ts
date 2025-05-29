import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/diEnums'
import { ISubscriptionUseCase } from '../../usecases/interfaces'
import { Request } from 'express'

@injectable()
export class ListSubscriptionCharges implements Handler {
  constructor(
    @inject(Locator.SubscriptionUseCase) private usecase: ISubscriptionUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { business } = req.query

    const charges = await this.usecase.listCharges(business as string)

    return {
      statusCode: 200,
      body: charges,
    }
  }
}
