import { Request } from 'express'
import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { IDetailsMenu } from '../../usecases/details.usecase'

@injectable()
export class DetailsMenuController implements Handler {
  constructor(
    @inject(Locator.DetailsMenuUseCase) private usecase: IDetailsMenu,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { id } = req.params
    const { business } = req.query
    const data = await this.usecase.details({
      id,
      business: business as string,
    })
    return {
      statusCode: 200,
      body: data,
    }
  }
}
