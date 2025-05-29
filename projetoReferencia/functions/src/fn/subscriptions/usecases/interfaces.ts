export interface ISubscriptionUseCase {
  createSubscription?(subscription: any): Promise<any>
  manageSubscriptionPayment?(payment: any): Promise<any>
  upgradeSubscription?(subscription: any): Promise<any>
  listCharges?(business: string): Promise<any[]>
  changeSubscriptionCard?(subscription: any): Promise<any>
  getSubscriptionCard?(subscription: any): Promise<any>
}
