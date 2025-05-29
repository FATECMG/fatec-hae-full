import { type HttpResponse } from '@common/http/Types'
import { badRequest, ok } from '@common/http/Helpers'
import { DeleteUseCase } from '@common/domain/UseCase.interface'
import { injectable } from 'inversify'

/**
 * A controller class that handles requests to delete an entity by its ID.
 */
@injectable()
export default class DeleteController {
  /**
   * Creates a new instance of the `DeleteController` class.
   * @param {DeleteUseCase} deleteOne - The `DeleteUseCase` object to use for deleting the entity.
   */
  constructor (private readonly deleteOne: DeleteUseCase) {}

  /**
   * Handles a request to delete an entity by its ID.
   * @param {string} id - The ID of the entity to delete.
   * @returns {Promise<HttpResponse<string>>} A `Promise` that resolves to an `HttpResponse` object.
   */
  async handle (id: string): Promise<HttpResponse<string>> {
    const result = await this.deleteOne.execute(id)
    return result.deleted ? ok(result.message) : badRequest(result.message)
  }
}
