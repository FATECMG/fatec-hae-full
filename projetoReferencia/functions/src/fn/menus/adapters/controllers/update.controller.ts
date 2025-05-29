import { Request } from 'express'
import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { IUpdateMenuUseCase } from '../../usecases/update.usecase'

@injectable()
export class UpdateMenuController implements Handler {
  constructor(
    @inject(Locator.UpdateMenuUseCase)
    private usecase: IUpdateMenuUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { id } = req.params
    const { menu, business } = req.body
    const data = await this.usecase.update({
      id,
      menu,
      business,
    })
    return {
      statusCode: 200,
      body: data,
    }
  }
}
