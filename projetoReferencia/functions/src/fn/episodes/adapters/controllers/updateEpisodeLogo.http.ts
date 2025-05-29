import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IEpisodeUseCase } from '../../usecases/interface.usecase'
import { validate } from '../../../../shared/decorators/validate'
import { ValidateUpdateEpisodeLogoHttp } from '../validations/validateUpdateEpisodeLogoHttp'
@injectable()
export class UpdateEpisodeLogoHttp implements Handler {
  constructor(
    @inject(Locator.EpisodeUseCase) private usecase: IEpisodeUseCase,
  ) {}
  @validate(new ValidateUpdateEpisodeLogoHttp())
  async handle(req: Request): Promise<ResponseReturn> {
    const { episode } = req.body
    const updatedEpisode = await this.usecase.updateLogo(episode)
    return {
      statusCode: 200,
      body: { _id: updatedEpisode._id, logo: updatedEpisode.logo },
    }
  }
}
