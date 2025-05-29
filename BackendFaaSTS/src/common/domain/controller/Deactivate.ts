import { type HttpResponse } from '@common/http/Types'
import { badRequest, ok } from '@common/http/Helpers'
import { DeactivateUseCase } from '@common/domain/UseCase.interface'

import { injectable } from 'inversify'

@injectable()
export default abstract class DeactivateController<T> {
  constructor (
    private readonly deactivate: DeactivateUseCase<T>
  ) {
  }

  async handle (id: string): Promise<HttpResponse<string>> {
    const result = await this.deactivate.execute(id)
    return result.deleted ? ok(result.message) : badRequest(result.message)
  }
}
