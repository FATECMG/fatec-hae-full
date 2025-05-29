import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IEpisodeUseCase } from '../../usecases/interface.usecase'

@injectable()
export class GetEpisodeMenusHttp implements Handler {
  constructor(
    @inject(Locator.EpisodeUseCase) private usecase: IEpisodeUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { episode } = req.params
    const { filters } = req.query
    const menus = await this.usecase.getMenus({ _id: episode }, filters)
    return {
      statusCode: 200,
      body: menus,
    }
  }
}
