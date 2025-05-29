import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { IOrdersUseCase } from '../../usecases/interfaces'
import { Request } from 'express'
import { validate } from '../../../../shared/decorators/validate'
import { UpdateOrderElevateHttpValidation } from './validations/updateOrderElevateHttpValidation'
@injectable()
export class UpdateOrderElevateHttp implements Handler {
  constructor(@inject(Locator.OrdersUseCase) private usecase: IOrdersUseCase) {}

  @validate(new UpdateOrderElevateHttpValidation())
  async handle(req: Request): Promise<ResponseReturn> {
    const { who, order } = req.body
    const { order: _id } = req.params
    const updatedOrder = await this.usecase.updateOrderElevate({
      order: { ...order, _id },
      who,
    })
    return {
      statusCode: 200,
      body: updatedOrder,
    }
  }
}
