import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import { ICreateUseCase } from '../../usecases/interfaces.usecases'
import { Locator } from '../../shared/di.enums'
import { validate } from '../../../../shared/decorators/validate'
import { CreateControllerValidation } from './validations/create.controller.validation'

@injectable()
export class CreateController implements Handler {
  constructor(@inject(Locator.CreateUseCase) createUsecase: ICreateUseCase) {
    this._createUsecase = createUsecase
  }
  private _createUsecase: ICreateUseCase

  @validate(new CreateControllerValidation())
  async handle(req: Request): Promise<ResponseReturn> {
    const createdBusiness = await this._createUsecase.create(req.body.business)
    return { statusCode: 200, body: createdBusiness }
  }
}
