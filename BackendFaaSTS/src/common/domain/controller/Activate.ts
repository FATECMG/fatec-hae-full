import { type HttpResponse } from '@common/http/Types'
import { badRequest, ok } from '@common/http/Helpers'
import { ActivateUseCase } from '@common/domain/UseCase.interface'

import { injectable } from 'inversify'

@injectable()
export default abstract class ActivateController<T> {
  constructor (
    private readonly activate: ActivateUseCase<T>
  ) {
  }

  async handle (id: string): Promise<HttpResponse<string>> {
    const result = await this.activate.execute(id)
    return result.deleted ? ok(result.message) : badRequest(result.message)
  }
}
