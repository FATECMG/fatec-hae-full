import { inject, injectable } from 'inversify'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { IBusinessRepository } from '../adapters/repositories/interfaces.repository'
import { Locator } from '../shared/di.enums'

export interface ICreditCardUseCase {
  exec?(body: { cardhash: string; business: string }): Promise<CreditCard>
}

export interface CreditCard {
  creditCardId?: string
  last4CardNumber: string
  expirationMonth: string
  expirationYear: string
}

@injectable()
export class CreditCardUseCase implements ICreditCardUseCase {
  public constructor(
    @inject(Locator.GenerateCreditCardExternal)
    private creditcardExternal: IExternal<{ cardhash: string }, CreditCard>,
    @inject(Locator.BusinessRepository)
    private repository: IBusinessRepository,
  ) {}

  async exec(body: { cardhash: string; business: string }) {
    const { cardhash, business } = body
    const result: CreditCard = await this.creditcardExternal.call({ cardhash })
    await this.repository.update(business, { creditcard: result })

    return {
      last4CardNumber: result.last4CardNumber,
      expirationMonth: result.expirationMonth,
      expirationYear: result.expirationYear,
    }
  }
}
