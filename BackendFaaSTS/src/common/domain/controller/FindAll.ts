import { type HttpResponse } from '@common/http/Types'
import { ok } from '@common/http/Helpers'
import { Mapper } from '@common/mapper/BaseMapper'
import { FindAllUseCase } from '@common/domain/UseCase.interface'

import { injectable } from 'inversify'

/**
 * An abstract controller class that handles requests to find all entities of a certain type.
 * @template E - The type of the entity to find.
 * @template P - The type of the presentation model to return.
 */
@injectable()
export default abstract class FindAllController<E, P> {
  /**
   * Creates a new instance of the `FindAllController` class.
   * @param {Mapper<E, P>} entityToPresentationModelMapper - The `Mapper` object to use for mapping entities to presentation models.
   * @param {FindAllUseCase<E>} findAll - The `FindAllUseCase` object to use for finding all entities.
   */
  constructor (
    private readonly entityToPresentationModelMapper: Mapper<E, P>,
    private readonly findAll: FindAllUseCase<E>
  ) {}

  /**
   * Handles a request to find all entities of a certain type.
   * @returns {Promise<HttpResponse<P[]>>} A `Promise` that resolves to an `HttpResponse` object.
   */
  async handle (active: boolean): Promise<HttpResponse<P[]>> {
    const objects = await this.findAll.execute(active)
    const presentation = []
    for (const resource of objects) {
      presentation.push(await this.entityToPresentationModelMapper.execute(resource))
    }
    return ok(presentation)
  }
}
