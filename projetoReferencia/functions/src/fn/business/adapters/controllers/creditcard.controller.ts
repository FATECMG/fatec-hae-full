import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import { Locator } from '../../shared/di.enums'
import { ICreditCardUseCase } from '../../usecases/creditcard.usecase'

@injectable()
export class CreditCardController implements Handler {
  constructor(
    @inject(Locator.CreditCardUseCase)
    private usecase: ICreditCardUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { cardhash, business } = req.body
    const result = await this.usecase.exec({ cardhash, business })
    return { statusCode: 200, body: result }
  }
}
