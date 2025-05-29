import { inject, injectable } from 'inversify'
import { IContractRepository } from '../adapters/repositories/interfaces'
import { Locator } from '../shared/di.enums'
import {
  IContractDetails,
  IContractDetailsBody,
  IContractDetailsResponse,
} from './interfaces'

@injectable()
export class ContractDetails implements IContractDetails {
  constructor(
    @inject(Locator.ContractRepository) private repository: IContractRepository,
  ) {}
  async exec(body: IContractDetailsBody): Promise<IContractDetailsResponse> {
    const { business } = body

    const {
      plan,
      status,
      expireTrial,
      cancelDate,
      lastPayment,
      paymentError,
      price,
      discount,
      nextBillingDate,
      subscription,
    } = await this.repository.findOne({ business: business as any })

    const hasCanceled = status === 'CANCELED'

    return {
      plan: {
        name: plan.name,
        id: plan.id?._id,
      },
      price,
      discount: discount,
      status,
      statusToDisplay: statusToDisplay[status],
      nextBillingDate: nextBillingDate?.toISOString(),
      expireTrial,
      cancelDate: hasCanceled ? cancelDate : null,
      lastPayment: lastPayment?.toISOString(),
      subscription,
      paymentError: paymentError
        ? {
            date: paymentError?.date,
            message: paymentError?.message,
          }
        : null,
    }
  }
}

const statusToDisplay = {
  PENDING: 'PENDENTE',
  TRIAL: 'TRIAL',
  ACTIVE: 'ATIVO',
  FREE: 'FREE',
  DISABLED: 'DESATIVADO',
  CANCELED: 'CANCELADO',
}
