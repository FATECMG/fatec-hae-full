import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IEpisodeUseCase } from '../../usecases/interface.usecase'
import { validate } from '../../../../shared/decorators/validate'
import { GetEpisodeDeliveryTypesHttpValidaton } from './validation/getEpisodeDeliveryTypesHttpValidation'
@injectable()
export class GetEpisodeDeliveryTypesHttp implements Handler {
  constructor(
    @inject(Locator.EpisodeUseCase) private usecase: IEpisodeUseCase,
  ) {}

  @validate(new GetEpisodeDeliveryTypesHttpValidaton())
  async handle(req: Request): Promise<ResponseReturn> {
    const { episode } = req.params
    const { filters } = req.query

    const deliveryTypes = await this.usecase.getDeliveryTypes(
      { _id: episode },
      filters,
    )
    return {
      statusCode: 200,
      body: deliveryTypes,
    }
  }
}
