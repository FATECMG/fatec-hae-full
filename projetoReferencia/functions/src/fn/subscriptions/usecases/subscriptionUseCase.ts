import { inject, injectable } from 'inversify'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { DomainError } from '../../../shared/errors/domain.error'
import { IBusinessRepository } from '../../business/adapters/repositories/interfaces.repository'
import { IContractRepository } from '../../contracts/adapters/repositories/interfaces'
import { IPlanRepository } from '../../plans/adapters/repositories/types'
import { Locator } from '../shared/diEnums'
import { ISubscriptionUseCase } from './interfaces'
import { differenceInDays, parseISO, addDays } from 'date-fns'
import { IBusiness } from '../../business/entities/interfaces.entity'
import { IPlanEntity } from '../../plans/entities/plan.entity'
import Dinero from 'dinero.js'

@injectable()
export class SubscriptionUseCase implements ISubscriptionUseCase {
  constructor(
    @inject(Locator.CreateSubscriptionExternal)
    private createSubscriptionExternal: IExternal<any, any>,
    @inject(Locator.BusinessRepository)
    private businessRepository: IBusinessRepository,
    @inject(Locator.PlanRepository) private planRepository: IPlanRepository,
    @inject(Locator.ContractRepository)
    private contractRepository: IContractRepository,
    @inject(Locator.DisableContractExternal)
    private disableContractExternal: IExternal<string, any>,
    @inject(Locator.GetSubscriptionExternal)
    private getSubscriptionExternal: IExternal<string, any>,
    @inject(Locator.CancelSubscriptionExternal)
    private cancelSubscriptionExternal: IExternal<string, void>,
    @inject(Locator.ListChargesExternal)
    private listChargesExternal: IExternal<string, any>,
    @inject(Locator.ChangeSubscriptionCardExternal)
    private changeSubscriptionCardExternal: IExternal<any, any>,
  ) {}

  private buildSubscription(
    business: IBusiness,
    plan: IPlanEntity,
    additionalData?: any,
  ) {
    const area_code = business.phone?.substring(1, 3)
    const number = business.phone?.substring(5)

    const subscription = {
      payment_method: 'credit_card',
      currency: 'BRL',
      interval: 'month',
      interval_count: 1,
      billing_type: 'prepaid',
      installments: 1,
      minimum_price: 0,
      customer_id: business.customer_id,
      customer: {
        name: business.name,
        email: business.email,
        type: 'individual',
        phones: {
          mobile_phone: {
            country_code: '55',
            area_code,
            number,
          },
        },
        document: business.cpf?.replace(/\D/g, ''),
      },
      statement_descriptor: `Zelpay Assina`,
      items: [
        {
          description: `Assinatura Zelpay ${plan.name}`,
          quantity: 1,
          pricing_scheme: {
            price: Math.round(plan.price * 100),
          },
        },
      ],
      ...additionalData,
    }

    if (subscription.customer_id) {
      delete subscription.customer
    }

    return subscription
  }

  async createSubscription(subscriptionPart: any): Promise<any> {
    const loadedBusiness = await this.businessRepository.findOne(
      subscriptionPart.business,
      'customer_id email name address contract cpf phone',
      { path: 'contract' },
    )

    const loadedPlan = await this.planRepository.findOne(
      {
        _id: subscriptionPart.plan,
      },
      'price features name',
    )

    const subscription = this.buildSubscription(loadedBusiness, loadedPlan, {
      card: {
        holder_name: subscriptionPart.holder_name,
        number: subscriptionPart.number,
        exp_month: parseInt(subscriptionPart.exp_month),
        exp_year: parseInt(subscriptionPart.exp_year),
        cvv: subscriptionPart.cvv,
        billing_address: {
          line_1: `${loadedBusiness?.address?.street}, ${loadedBusiness?.address?.number}, ${loadedBusiness?.address?.neighborhood}`,
          zip_code: loadedBusiness?.address?.postCode?.replace(/\D/g, ''),
          city: loadedBusiness?.address?.city,
          state: loadedBusiness?.address?.state,
          country: 'BR',
        },
      },
    })

    let result

    if (loadedBusiness.contract.discount) {
      subscription.discounts = [
        {
          cycles: 1,
          value: Math.round(loadedBusiness.contract.discount * 100),
          discount_type: 'flat',
        },
      ]
    }
    try {
      result = await this.createSubscriptionExternal.call(subscription)
    } catch (error) {
      console.error(error.response?.data?.message)
      throw new DomainError({
        errorCode: '01 - create subscription',
        message:
          error.response?.data?.message || 'Não conseguimos criar a assinatura',
      })
    }

    await this.businessRepository.update(loadedBusiness._id, {
      customer_id: result.customer.id,
    })

    await this.contractRepository.updateById(
      loadedBusiness.contract as string,
      {
        plan: {
          id: loadedPlan._id,
          name: loadedPlan.name,
        },
        subscription: result.id,
        features: loadedPlan.features,
        status: 'ACTIVE',
        price: loadedPlan.price,
        nextBillingDate: result.next_billing_at,
        lastPayment: new Date().toISOString(),
        discount: 0,
      },
    )

    return result
  }

  async manageSubscriptionPayment(invoice: any): Promise<void> {
    const {
      data: {
        customer: { id },
      },
      type,
    } = invoice

    const loadedBusiness = await this.businessRepository.findOneByParams(
      {
        customer_id: id,
      },
      '_id contract',
    )

    if (!loadedBusiness) {
      throw new DomainError({
        errorCode: '02 - manage subscription payment',
        message: 'Não conseguimos encontrar o business.',
      })
    }

    if (type === 'invoice.payment_failed') {
      console.warn('Payment failed, business:', loadedBusiness._id)
      await this.disableContractExternal.call(loadedBusiness.contract as string)
      await this.contractRepository.updateById(
        loadedBusiness.contract as string,
        {
          paymentError: {
            date: new Date().toISOString(),
            message: 'Tivemos um problema ao processar o pagamento',
          },
        },
      )
    }
  }

  async upgradeSubscription(subscriptionPart: any): Promise<any> {
    const { business, plan } = subscriptionPart
    const loadedBusiness = await this.businessRepository.findOne(
      business,
      'contract customer_id',
      { path: 'contract' },
    )

    if (!loadedBusiness) {
      throw new DomainError({
        errorCode: '03 - upgrade subscription',
        message: 'Não conseguimos encontrar o business.',
      })
    }

    const loadedPlan = await this.planRepository.findOne(
      {
        _id: plan,
      },
      'price features name',
    )

    if (loadedPlan.price === 0) {
      await this.contractRepository.updateById(
        loadedBusiness.contract as string,
        {
          status: 'FREE',
          features: loadedPlan.features,
          subscription: null,
          plan: {
            id: loadedPlan._id,
            name: loadedPlan.name,
          },
          price: loadedPlan.price,
          nextBillingDate: null,
          lastPayment: null,
        },
      )
      await this.cancelSubscriptionExternal.call(
        loadedBusiness.contract?.subscription as string,
      )
      console.log('Downgrade successful')
      return
    }

    const loadedSubscription = await this.getSubscriptionExternal.call(
      loadedBusiness.contract.subscription,
    )

    let remainingDays = differenceInDays(
      parseISO(loadedSubscription.next_billing_at),
      new Date(),
    )

    remainingDays = remainingDays > 0 ? remainingDays : 0

    const start_at = addDays(new Date(), remainingDays).toISOString()

    const subscription = await this.buildSubscription(
      loadedBusiness,
      loadedPlan,
      {
        card_id: loadedSubscription.card.id,
        start_at,
      },
    )

    if (loadedBusiness.contract.discount) {
      subscription.discounts = [
        {
          cycles: 1,
          value: Math.round(loadedBusiness.contract.discount * 100),
          discount_type: 'flat',
        },
      ]
    }

    try {
      const newSubscription = await this.createSubscriptionExternal.call(
        subscription,
      )
      await this.contractRepository.updateById(
        loadedBusiness.contract as string,
        {
          status: 'ACTIVE',
          features: loadedPlan.features,
          subscription: newSubscription.id,
          plan: {
            id: loadedPlan._id,
            name: loadedPlan.name,
          },
          discount: 0,
          price: loadedPlan.price,
          nextBillingDate: newSubscription.next_billing_at,
          lastPayment: new Date().toISOString(),
        },
      )
    } catch (error) {
      console.error(error?.response?.data)
      throw new DomainError({
        errorCode: '04 - upgrade subscription',
        message: 'Não conseguimos atualizar a assinatura.',
      })
    }

    try {
      await this.cancelSubscriptionExternal.call(loadedSubscription.id)
    } catch (error) {
      console.error(error?.response?.data)
    }

    return {}
  }

  async listCharges(business: string): Promise<any[]> {
    const loadedBusiness = await this.businessRepository.findOne(
      business,
      'customer_id',
    )

    if (!loadedBusiness || !loadedBusiness.customer_id) {
      return []
    }
    const charges = await this.listChargesExternal.call(
      loadedBusiness.customer_id,
    )
    const newCharges = charges?.data?.map((charge: any) => {
      return {
        status: charge.status,
        amount: Dinero({ amount: charge.amount }).toUnit(),
        createdAt: charge.created_at,
      }
    })

    return newCharges || []
  }

  async changeSubscriptionCard(subscription?: any): Promise<any> {
    const { business, ...rest } = subscription
    const loadedBusiness = await this.businessRepository.findOne(
      business,
      'contract customer_id address',
      {
        path: 'contract',
      },
    )

    if (!loadedBusiness) {
      throw new DomainError({
        errorCode: '05 - change subscription card',
        message: 'Não conseguimos encontrar o business.',
      })
    }

    const newSubscription = {
      id: loadedBusiness.contract.subscription,
      card: {
        ...rest.card,
        billing_address: {
          line_1: `${loadedBusiness?.address?.street}, ${loadedBusiness?.address?.number}, ${loadedBusiness?.address?.neighborhood}`,
          zip_code: loadedBusiness?.address?.postCode?.replace(/\D/g, ''),
          city: loadedBusiness?.address?.city,
          state: loadedBusiness?.address?.state,
          country: 'BR',
        },
      },
    }

    try {
      await this.changeSubscriptionCardExternal.call(newSubscription)
    } catch (error) {
      console.error(error)
      throw new DomainError({
        errorCode: '06 - change subscription card',
        message: 'Não conseguimos atualizar a assinatura.',
      })
    }
  }

  async getSubscriptionCard(subscription: any): Promise<any> {
    const { business } = subscription
    const loadedBusiness = await this.businessRepository.findOne(
      business,
      'contract customer_id',
      {
        path: 'contract',
      },
    )

    if (!loadedBusiness) {
      throw new DomainError({
        errorCode: '07 - get subscription card',
        message: 'Não conseguimos encontrar o business.',
      })
    }

    if (!loadedBusiness.contract?.subscription) {
      throw new DomainError({
        errorCode: '09 - get subscription card',
        message: 'Não conseguimos encontrar a assinatura.',
      })
    }
    let loadedSubscription: any
    try {
      loadedSubscription = await this.getSubscriptionExternal.call(
        loadedBusiness.contract.subscription,
      )
    } catch (error) {
      console.error(error)
      throw new DomainError({
        errorCode: '08 - get subscription card',
        message: 'Não conseguimos obter a assinatura.',
      })
    }

    return loadedSubscription.card
  }
}
