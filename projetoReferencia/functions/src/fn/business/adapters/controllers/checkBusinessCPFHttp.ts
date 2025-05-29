import { inject, injectable } from 'inversify'
import { Request } from 'express'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { IBusinessUseCase } from '../../usecases/interfaces.usecases'
import { validate } from '../../../../shared/decorators/validate'
import { CheckBusinessCPFHttpValidation } from './validations/checkBusinessCPFHttpValidation'
@injectable()
export class CheckBusinessCPFHttp implements Handler {
  constructor(
    @inject(Locator.BusinessUseCase) private usecase: IBusinessUseCase,
  ) {}

  @validate(new CheckBusinessCPFHttpValidation())
  async handle(req: Request): Promise<ResponseReturn> {
    const { cpf } = req.params
    const result = await this.usecase.checkCPF(cpf)
    return { statusCode: 200, body: { valid: !result } }
  }
}
