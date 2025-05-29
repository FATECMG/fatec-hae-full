import { type HttpResponse } from '@common/http/Types'
import { ok } from '@common/http/Helpers'
import { Mapper } from '@common/mapper/BaseMapper'
import { FindAllWithFilterUseCase } from '@common/domain/UseCase.interface'

import { injectable } from 'inversify'
import { type Filter } from '@common/utils/filter/Filter'

/**
 * An abstract controller class that handles requests to find all entities of a certain type.
 * @template E - The type of the entity to find.
 * @template P - The type of the presentation model to return.
 * @template F - The type of the filter to use. It must extend the `Filter` interface.
 */
@injectable()
export default abstract class FindAllControllerWithFilter<E, P, F extends Filter> {
  /**
   * Creates a new instance of the `FindAllController` class.
   * @param {Mapper<E, P>} entityToPresentationModelMapper - The `Mapper` object to use for mapping entities to presentation models.
   * @param {FindAllWithFilterUseCase<E, F>} findAll - The `FindAllUseCase` object to use for finding all entities with a specific Filter.
   */
  constructor (
    private readonly entityToPresentationModelMapper: Mapper<E, P>,
    private readonly findAll: FindAllWithFilterUseCase<E, F>
  ) {}

  /**
   * Handles a request to find all entities of a certain type.
   * @returns {Promise<HttpResponse<P[]>>} A `Promise` that resolves to an `HttpResponse` object.
   */
  async handle (params: F): Promise<HttpResponse<P[]>> {
    const objects = await this.findAll.execute(params)
    const presentation = []
    for (const resource of objects) {
      presentation.push(await this.entityToPresentationModelMapper.execute(resource))
    }
    return ok(presentation)
  }
}
