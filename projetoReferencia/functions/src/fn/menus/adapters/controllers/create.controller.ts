import { Request } from 'express'
import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { validate } from '../../../../shared/decorators/validate'
import { Locator } from '../../shared/di.enums'
import { ICreateMenu } from '../../usecases/create.usecase'
import { CreateMenuControllerValidation } from './validations/create.menu.validation'

@injectable()
export class CreateMenuController implements Handler {
  constructor(
    @inject(Locator.CreateMenuUseCase) private usecase: ICreateMenu,
  ) {}
  @validate(new CreateMenuControllerValidation())
  async handle(req: Request): Promise<ResponseReturn> {
    const menu = req.body
    const data = await this.usecase.createMenu(menu)
    return {
      statusCode: 200,
      body: data,
    }
  }
}
