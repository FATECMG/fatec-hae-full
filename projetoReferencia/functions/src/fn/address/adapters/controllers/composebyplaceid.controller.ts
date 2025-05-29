import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import { Locator } from '../../shared/di.enums'
import { validate } from '../../../../shared/decorators/validate'
import { ComposeByPlaceIdControllerValidation } from './validations/composebyplaceid.controller.validation'
import { IComposeByPlaceIdUseCase } from '../../usecases/interfaces.usecases'

@injectable()
export class ComposeByPlaceIdController implements Handler {
  constructor(
    @inject(Locator.ComposeByPlaceIdUseCase)
    private composeByPlaceIdUseCase: IComposeByPlaceIdUseCase,
  ) {}

  @validate(new ComposeByPlaceIdControllerValidation())
  async handle(req: Request): Promise<ResponseReturn> {
    const { placeId } = req.params
    const populatedAddress = await this.composeByPlaceIdUseCase.compose(placeId)
    return { statusCode: 200, body: populatedAddress }
  }
}
