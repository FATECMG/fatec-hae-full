import { Container } from 'inversify'
import { IPubSubTrigger } from '../../../shared/adapters/controllers/interfaces'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { SendEmailTrigger } from '../adapters/controllers/sendEmailTrigger'
import { SendExternal } from '../adapters/externals/sendExternal'
import { EmailsUseCase } from '../usecases/emails'
import { IEmailsUseCase } from '../usecases/interfaces'
import { Locator } from './enums.di'

export const container = new Container()
container.bind<IEmailsUseCase>(Locator.EmailsUseCase).to(EmailsUseCase)
container.bind<IExternal<any, void>>(Locator.SendExternal).to(SendExternal)
container.bind<IPubSubTrigger>(Locator.EmailsTrigger).to(SendEmailTrigger)
