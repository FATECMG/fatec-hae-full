import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { IBusinessUseCase } from '../../usecases/interfaces.usecases'
import { Request } from 'express'

@injectable()
export class ListFeaturesHttp implements Handler {
  constructor(
    @inject(Locator.BusinessUseCase) private usecase: IBusinessUseCase,
  ) {}
  async handle(req: Request): Promise<ResponseReturn> {
    const { business } = req.params
    const features = await this.usecase.listFeatures({ _id: business })
    return {
      statusCode: 200,
      body: features,
    }
  }
}
