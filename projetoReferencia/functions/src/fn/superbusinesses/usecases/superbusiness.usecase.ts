import { inject, injectable } from 'inversify'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { validate } from '../../../shared/decorators/validate'
import { Auth } from '../adapters/externals/login.firebase.superbusiness.external'
import { ISuperBusinessRepository } from '../adapters/repositories/interfaces.repositories'
import { ISuperBusiness } from '../entities/interfaces.entities'
import { Locator } from '../shared/di.enums'
import { ISuperBusinessUseCase } from './interfaces.usecases'
import { LoginSuperBusinessValidation } from './validations/login.superbusiness.usecases.validation'

@injectable()
export class SuperBusinessUseCase implements ISuperBusinessUseCase {
  constructor(
    @inject(Locator.SuperBusinessLoginFirebaseExternal)
    private loginFirebase: IExternal<ISuperBusiness, Auth>,
    @inject(Locator.SuperBusinessRepository)
    private repository: ISuperBusinessRepository,
  ) {}
  @validate(new LoginSuperBusinessValidation())
  async login(
    superBusiness: ISuperBusiness,
  ): Promise<{ superb: ISuperBusiness; jwt: string }> {
    const logged = await this.loginFirebase.call(superBusiness)
    const loaded = await this.repository.login({
      firestoreUid: logged.firestoreUid,
    })
    return { superb: loaded, jwt: logged.jwt }
  }
}
