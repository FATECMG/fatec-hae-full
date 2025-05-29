import { inject, injectable } from 'inversify'
import { validate } from '../../../shared/decorators/validate'
import { IBusinessRepository } from '../adapters/repositories/interfaces.repository'
import BusinessValidation from './validations/business.validation'
import { parse } from 'date-fns'
import { IBusiness, MissingDocuments } from '../entities/interfaces.entity'
import { ICreateUseCase } from './interfaces.usecases'
import { Locator } from '../shared/di.enums'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { getAuthorizationToken } from '../../../shared/adapters/external/getAuthTokenFromJuno.external'
import { Credential } from '../adapters/external/createFirebaseAccount.external'
import { IAddress } from '../../address/entities/interfaces.entity'
import { DomainError } from '../../../shared/errors/domain.error'
import { IEpisode } from '../../episodes/entities/interfaces'
import { IContract } from '../../contracts/entities/interfaces'
import { CreateBusinessJiraCardBody } from '../adapters/external/createBusinessJiraCard'

@injectable()
export class CreateUseCase implements ICreateUseCase {
  public constructor(
    @inject(Locator.BusinessRepository) private repository: IBusinessRepository,
    @inject(Locator.CreateDigitalAccountExternal)
    private createDigitalAccount: IExternal<
      IBusiness & { authToken: string },
      IBusiness
    >,
    @inject(Locator.GetDigitalAccountPublicKeyExternal)
    private getDigitalAccountPublicKey: IExternal<
      {
        resourceToken: string
        authToken: string
      },
      string
    >,
    @inject(Locator.GetMissingDocumentsExternal)
    private getMissingDocuments: IExternal<
      {
        resourceToken: string
        authToken: string
      },
      MissingDocuments
    >,
    @inject(Locator.CreateFirebaseAccountExternal)
    private createFirebaseAccount: IExternal<Credential, string>,
    @inject(Locator.ComposeAddressPlaceIdExternal)
    private composeAddressByPlace: IExternal<string, IAddress>,
    @inject(Locator.CreateEpisodeExternal)
    private createEpisode: IExternal<IEpisode, void>,
    @inject(Locator.CreateContractExternal)
    private createContract: IExternal<IContract, void>,
    @inject(Locator.SendWelcomeEmailExternal)
    private sendWelcomeEmailExternal: IExternal<IBusiness, void>,
    @inject(Locator.CreateBusinessJiraCardExternal)
    private sendCreateBusinessJiraCardExternal: IExternal<
      CreateBusinessJiraCardBody,
      void
    >,
  ) {}

  @validate(new BusinessValidation())
  async create(business: IBusiness): Promise<IBusiness> {
    const { contract } = business
    if (business.createdBy.text === 'admin') {
      try {
        const admin = await this.repository.checkAdminExists(
          business.createdBy.user._id,
        )
        if (!admin) {
          throw new DomainError({
            message: 'Adm responsável não existe.',
            errorCode: '001 - business',
          })
        }
      } catch (err) {
        throw new DomainError({
          message: 'Erro ao buscar o adm responsável.',
          errorCode: '002 - business',
        })
      }
    }

    const address = await this.composeAddressByPlace.call(
      business.address.placeId,
    )
    business.address = { ...business.address, ...address }
    business.birthDate = business.birthDate
      ? parse(
          (business.birthDate as unknown) as string,
          'dd-MM-yyyy',
          new Date(),
        )
      : undefined

    //create digital account if all data were input
    if (
      business.birthDate &&
      business.bank &&
      business.bank.account &&
      business.bank.agency &&
      business.bank.number &&
      business.cnpj
    ) {
      const authToken = await getAuthorizationToken()
      const digitalAccount = await this.createDigitalAccount.call({
        ...business,
        authToken,
      })
      business.paymentId = digitalAccount.paymentId
      business.resourceToken = digitalAccount.resourceToken
      const publicKey = await this.getDigitalAccountPublicKey.call({
        authToken,
        resourceToken: business.resourceToken,
      })
      business.paymentPublicKey = publicKey
      const missingDocuments = await this.getMissingDocuments.call({
        authToken,
        resourceToken: business.resourceToken,
      })
      const [
        document,
        selfie,
        companyDoc,
      ] = missingDocuments._embedded.documents
      business.document = {
        id: document.id,
        status: document.approvalStatus,
      }
      business.selfie = {
        id: selfie.id,
        status: selfie.approvalStatus,
      }
      business.companyDoc = {
        id: companyDoc.id,
        status: companyDoc.approvalStatus,
      }
    }
    try {
      const firestoreUid = await this.createFirebaseAccount.call({
        email: business.email,
        password: business.password,
      })
      business.firestoreUid = firestoreUid
      delete business.password
    } catch (err) {
      console.warn(err)
      if (err.message.startsWith('The email address is already')) {
        throw new DomainError({
          message: 'Email já existe 🧐',
          errorCode: '003 - Business',
        })
      }
      throw err
    }
    const createdBusiness = await this.repository.create(business)
    try {
      await this.createEpisode.call({
        business: { id: createdBusiness.id },
        address: {
          placeId: business.address.placeId,
          text: business.address.text,
        },
      })
    } catch (err) {
      console.warn(err)
    }
    try {
      await this.createContract.call({
        ...contract,
        plan: {
          id: contract.plan,
        },
        business: { id: createdBusiness.id },
      })
    } catch (err) {
      console.warn(err)
    }

    try {
      await this.sendWelcomeEmailExternal.call(createdBusiness)
    } catch (err) {
      console.warn(err)
    }

    try {
      await this.sendCreateBusinessJiraCardExternal.call({
        businessId: createdBusiness.id,
      })
    } catch (err) {
      console.warn(err)
    }

    return createdBusiness
  }
}
