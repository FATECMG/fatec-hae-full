import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/diEnums'
import { ISubscriptionUseCase } from '../../usecases/interfaces'
@injectable()
export class ChangeSubscriptionCardHttp implements Handler {
  constructor(
    @inject(Locator.SubscriptionUseCase) private usecase: ISubscriptionUseCase,
  ) {}
  async handle(req: Request): Promise<ResponseReturn> {
    await this.usecase.changeSubscriptionCard(req.body)
    return {
      statusCode: 200,
      body: {},
    }
  }
}
