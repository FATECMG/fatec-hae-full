import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/diEnums'
import { ISubscriptionUseCase } from '../../usecases/interfaces'
@injectable()
export class GetSubscriptionCardHttp implements Handler {
  constructor(
    @inject(Locator.SubscriptionUseCase) private usecase: ISubscriptionUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { business } = req.query
    const card = await this.usecase.getSubscriptionCard({ business })
    return { statusCode: 200, body: card }
  }
}
