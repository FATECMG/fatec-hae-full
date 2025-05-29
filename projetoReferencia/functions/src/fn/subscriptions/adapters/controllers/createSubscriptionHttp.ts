import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/diEnums'
import { ISubscriptionUseCase } from '../../usecases/interfaces'

@injectable()
export class CreateSubscriptionHttp implements Handler {
  constructor(
    @inject(Locator.SubscriptionUseCase)
    private subscriptionUseCase: ISubscriptionUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const subscription = req.body
    const result = await this.subscriptionUseCase.createSubscription(
      subscription,
    )
    return {
      statusCode: 200,
      body: result,
    }
  }
}
