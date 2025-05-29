import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IEpisodeUseCase } from '../../usecases/interface.usecase'
@injectable()
export class isShortLinkAvailableController implements Handler {
  constructor(
    @inject(Locator.EpisodeUseCase) private usecase: IEpisodeUseCase,
  ) {}
  async handle(req: Request): Promise<ResponseReturn> {
    const { shortLink } = req.query
    const isAvailable = await this.usecase.isShortLinkAvailable(
      shortLink as string,
    )
    return {
      statusCode: 200,
      body: { isAvailable },
    }
  }
}
