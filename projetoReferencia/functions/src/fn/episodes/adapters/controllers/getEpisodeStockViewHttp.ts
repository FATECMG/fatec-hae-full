import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import { Locator } from '../../shared/di.enums'
import { IEpisodeUseCase } from '../../usecases/interface.usecase'

@injectable()
export class GetEpisodeStockViewHttp implements Handler {
  constructor(
    @inject(Locator.EpisodeUseCase) private usecase: IEpisodeUseCase,
  ) {}

  public async handle(req: Request): Promise<ResponseReturn> {
    const { episode: _id } = req.params
    const { filters } = req.query
    const episode = await this.usecase.getStockView({ _id }, filters)
    return {
      statusCode: 200,
      body: episode,
    }
  }
}
