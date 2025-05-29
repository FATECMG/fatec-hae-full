import { inject, injectable } from 'inversify'
import { Request } from 'express'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/diEnums'
import { ISubscriptionUseCase } from '../../usecases/interfaces'

@injectable()
export class ManageSubscriptionPaymentHttp implements Handler {
  constructor(
    @inject(Locator.SubscriptionUseCase) private usecase: ISubscriptionUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    await this.usecase.manageSubscriptionPayment(req.body)
    return {
      statusCode: 200,
      body: {},
    }
  }
}
