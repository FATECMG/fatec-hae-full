import { inject, injectable } from 'inversify'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { IEmail } from '../entities/interfaces'
import { Locator } from '../shared/enums.di'
import { IEmailsUseCase } from './interfaces'

@injectable()
export class EmailsUseCase implements IEmailsUseCase {
  constructor(
    @inject(Locator.SendExternal) private sendExternal: IExternal<IEmail, void>,
  ) {}
  async send(email: IEmail): Promise<void> {
    await this.sendExternal.call(email)
  }
}
