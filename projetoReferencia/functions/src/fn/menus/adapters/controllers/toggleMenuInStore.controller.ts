import { Request } from 'express'
import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { IToggleMenuInStore } from '../../usecases/toggleMenuInStore'

@injectable()
export class ToggleMenuInStoreController implements Handler {
  constructor(
    @inject(Locator.ToggleMenuInStoreUseCase)
    private usecase: IToggleMenuInStore,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { menu, business } = req.body
    const data = await this.usecase.toggle({
      menu,
      business,
    })
    return {
      statusCode: 200,
      body: data,
    }
  }
}
