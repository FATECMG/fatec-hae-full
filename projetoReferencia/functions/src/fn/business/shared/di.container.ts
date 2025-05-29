import { Container } from 'inversify'
import { Handler } from '../../../shared/adapters/controllers/interfaces'
import { CreateController } from '../adapters/controllers/create.controller'
import { BusinessRepository } from '../adapters/repositories/business.repository'
import { IBusinessRepository } from '../adapters/repositories/interfaces.repository'
import { CreateUseCase } from '../usecases/create.usecase'
import {
  IBankUseCase,
  IBusinessUseCase,
  ICreateUseCase,
} from '../usecases/interfaces.usecases'
import { Locator } from './di.enums'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { CreateDigitalAccount } from '../adapters/external/createDigitalAccount.external'
import {
  CreateFirebaseAccount,
  Credential,
} from '../adapters/external/createFirebaseAccount.external'
import { GetDigitalAccountPublicKey } from '../adapters/external/getDigitalAccountPublicKey.external'
import { GetMissingDocuments } from '../adapters/external/getMissingDocuments.extermal'
import {
  IBank,
  IBusiness,
  MissingDocuments,
} from '../entities/interfaces.entity'
import { ComposeAddressByPlaceIdExternal } from '../adapters/external/composeAddressByPlaceId.external'
import { IAddress } from '../../address/entities/interfaces.entity'
import { ListBankExternal } from '../adapters/external/list.bank.external'
import { ListBankUseCase } from '../usecases/list.bank.usecase'
import { ListBankController } from '../adapters/controllers/list.bank.controller'
import { IEpisode } from '../../episodes/entities/interfaces'
import { CreateEpisodeExternal } from '../adapters/external/create.episode.external'
import { CreateContractExternal } from '../adapters/external/create.contract.external'
import { IContract } from '../../contracts/entities/interfaces'
import { BusinessUseCase } from '../usecases/business.usecase'
import { ListBusinessesHttp } from '../adapters/controllers/list.businesses.http'
import { GetBusinessHttps } from '../adapters/controllers/get.business.https'
import { SendWelcomeEmailExternal } from '../adapters/external/sendWelcomeEmailExternal'
import { CheckBusinessCPFHttp } from '../adapters/controllers/checkBusinessCPFHttp'
import { CheckBusinessEmailHttp } from '../adapters/controllers/checkBusinessEmailHttp'
import {
  CreditCard,
  CreditCardUseCase,
  ICreditCardUseCase,
} from '../usecases/creditcard.usecase'
import { GenerateCreditCardToken } from '../adapters/external/genereateCreditCardToken.external'
import { CreditCardController } from '../adapters/controllers/creditcard.controller'
import { ListFeaturesHttp } from '../adapters/controllers/listFeaturesHttp'
import {
  CreateBusinessJiraCard,
  CreateBusinessJiraCardBody,
} from '../adapters/external/createBusinessJiraCard'

const container = new Container()
container.bind<Handler>(Locator.CreateController).to(CreateController)
container.bind<ICreateUseCase>(Locator.CreateUseCase).to(CreateUseCase)
container
  .bind<IBusinessRepository>(Locator.BusinessRepository)
  .to(BusinessRepository)
container
  .bind<IExternal<IBusiness & { authToken: string }, IBusiness>>(
    Locator.CreateDigitalAccountExternal,
  )
  .to(CreateDigitalAccount)
container
  .bind<IExternal<Credential, string>>(Locator.CreateFirebaseAccountExternal)
  .to(CreateFirebaseAccount)
container
  .bind<
    IExternal<
      {
        resourceToken: string
        authToken: string
      },
      string
    >
  >(Locator.GetDigitalAccountPublicKeyExternal)
  .to(GetDigitalAccountPublicKey)
container
  .bind<
    IExternal<
      {
        resourceToken: string
        authToken: string
      },
      MissingDocuments
    >
  >(Locator.GetMissingDocumentsExternal)
  .to(GetMissingDocuments)
container
  .bind<IExternal<string, IAddress>>(Locator.ComposeAddressPlaceIdExternal)
  .to(ComposeAddressByPlaceIdExternal)
container
  .bind<IExternal<string, Array<IBank>>>(Locator.ListBankExternal)
  .to(ListBankExternal)
container.bind<IBankUseCase>(Locator.ListBankUseCase).to(ListBankUseCase)
container.bind<Handler>(Locator.ListBankController).to(ListBankController)
container
  .bind<IExternal<IEpisode, void>>(Locator.CreateEpisodeExternal)
  .to(CreateEpisodeExternal)
container
  .bind<IExternal<IContract, void>>(Locator.CreateContractExternal)
  .to(CreateContractExternal)
container.bind<IBusinessUseCase>(Locator.BusinessUseCase).to(BusinessUseCase)
container.bind<Handler>(Locator.ListBusinessesHttp).to(ListBusinessesHttp)
container.bind<Handler>(Locator.GetBusinessHttps).to(GetBusinessHttps)
container
  .bind<IExternal<IBusiness, void>>(Locator.SendWelcomeEmailExternal)
  .to(SendWelcomeEmailExternal)
container.bind<Handler>(Locator.CheckBusinessCPFHttp).to(CheckBusinessCPFHttp)
container
  .bind<Handler>(Locator.CheckBusinessEmailHttp)
  .to(CheckBusinessEmailHttp)
container
  .bind<IExternal<{ cardhash: string }, CreditCard>>(
    Locator.GenerateCreditCardExternal,
  )
  .to(GenerateCreditCardToken)
container
  .bind<ICreditCardUseCase>(Locator.CreditCardUseCase)
  .to(CreditCardUseCase)
container.bind<Handler>(Locator.CreditCardController).to(CreditCardController)
container.bind<Handler>(Locator.ListFeaturesHttp).to(ListFeaturesHttp)
container
  .bind<IExternal<CreateBusinessJiraCardBody, void>>(
    Locator.CreateBusinessJiraCardExternal,
  )
  .to(CreateBusinessJiraCard)
export { container }
