import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IRemoveMenuUseCase } from '../../usecases/removeMenuUseCase'

@injectable()
export class RemoveMenuHttp implements Handler {
  constructor(
    @inject(Locator.RemoveMenuUseCase) private usecase: IRemoveMenuUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { menu } = req.params
    const { episode } = req.body
    await this.usecase.removeMenu(menu, episode)
    return {
      statusCode: 200,
      body: {},
    }
  }
}
