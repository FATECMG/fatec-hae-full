import { inject, injectable } from 'inversify'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { IBusinessRepository } from '../../business/adapters/repositories/interfaces.repository'
import { ICollaborator } from '../../collaborators/entities/interfaces'
import { IEpisodeRepository } from '../../episodes/adapters/repositories/interfaces.repository'
import { Auth } from '../adapters/external/login.firebase.external'
import { ILogin } from '../entities/interfaces'
import { Locator } from '../shared/di.enums'
import { ILoginUseCase } from './interfaces'
import bcrypt from 'bcryptjs'
import { DomainError } from '../../../shared/errors/domain.error'
import { getZelpayPublicKey } from '../../../shared/firebase'

@injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    @inject(Locator.LoginFirebaseExternal)
    private loginFirebase: IExternal<ILogin, Auth>,
    @inject(Locator.BusinessRepository)
    private businessRepository: IBusinessRepository,
    @inject(Locator.EpisodeRepository) private episodeRepo: IEpisodeRepository,
    @inject(Locator.FindOneCollaboratorExternal)
    private findOneCollaboratorExternal: IExternal<
      ICollaborator,
      ICollaborator
    >,
  ) {}

  async login(login: ILogin): Promise<ILogin> {
    const logged = await this.loginFirebase.call(login)
    let user = await this.businessRepository.loginUser('Business', logged)
    if (user && user.active) {
      const publicKey = await getZelpayPublicKey()
      if (user.creditcard) {
        delete user.creditcard.creditCardId
      }
      return { ...user, publicKey }
    }
    user = await this.businessRepository.loginUser('SuperBusiness', logged)
    if (user && user.active) {
      return user
    }
    user = await this.businessRepository.loginUser('Administrador', logged)
    if (user && user.active) {
      return user
    }
  }

  async loginCollab(login: ILogin): Promise<ICollaborator> {
    const episode = await this.episodeRepo.findOne(
      { _id: login.episode._id },
      'collaboratorsPassword',
    )

    const collaborator = {
      name: login.email,
      episode: {
        _id: login.episode._id,
      },
    }

    const loadedCollaborator = await this.findOneCollaboratorExternal.call(
      collaborator,
    )

    if (!bcrypt.compareSync(login.password, episode.collaboratorsPassword)) {
      throw new DomainError({
        errorCode: 'login-010',
        message: 'Senha incorreta.',
      })
    }

    return loadedCollaborator
  }

  async loginPrep(login: ILogin): Promise<void> {
    const episode = await this.episodeRepo.findOne(
      { _id: login.episode._id },
      'collaboratorsPassword',
    )

    if (!bcrypt.compareSync(login.password, episode.collaboratorsPassword)) {
      throw new DomainError({
        errorCode: 'login-010',
        message: 'Senha incorreta.',
      })
    }
  }
}
