import { inject, injectable } from 'inversify'
import { getAuthorizationToken } from '../../../shared/adapters/external/getAuthTokenFromJuno.external'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { IBank } from '../entities/interfaces.entity'
import { Locator } from '../shared/di.enums'
import { IBankUseCase } from './interfaces.usecases'

@injectable()
export class ListBankUseCase implements IBankUseCase {
  constructor(
    @inject(Locator.ListBankExternal)
    private listBankExternal: IExternal<string, Array<IBank>>,
  ) {}
  async list(): Promise<Array<IBank>> {
    const authToken = await getAuthorizationToken()
    const banks = await this.listBankExternal.call(authToken)
    return banks
  }
}
