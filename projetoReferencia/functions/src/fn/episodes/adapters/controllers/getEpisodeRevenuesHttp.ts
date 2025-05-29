import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { IEpisodeUseCase } from '../../usecases/interface.usecase'
import { Request } from 'express'
import { validate } from '../../../../shared/decorators/validate'
import { GetEpisodeRevenuesHttpValidaton } from './validation/getEpisodeRevenuesHttpValidaton'
@injectable()
export class GetEpisodeRevenuesHttp implements Handler {
  constructor(
    @inject(Locator.EpisodeUseCase) private usecase: IEpisodeUseCase,
  ) {}

  @validate(new GetEpisodeRevenuesHttpValidaton())
  async handle(req: Request): Promise<ResponseReturn> {
    const { episode, filters } = req.query
    const revenues = await this.usecase.getRevenues({ _id: episode }, filters)
    return { statusCode: 200, body: revenues }
  }
}
