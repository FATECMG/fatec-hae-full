import { type HttpResponse } from '@common/http/Types'
import { notFound, ok } from '@common/http/Helpers'
import { Mapper } from '@common/mapper/BaseMapper'
import { FindOneUseCase } from '@common/domain/UseCase.interface'
import { injectable } from 'inversify'

/**
 * An abstract controller class that handles requests to find an entity by its ID.
 * @template E - The type of the entity to find.
 * @template P - The type of the presentation model to return.
 */
@injectable()
export default abstract class FindOneController<E, P> {
  /**
   * Creates a new instance of the `FindOneController` class.
   * @param {Mapper<E, P>} entityToPresentationModelMapper - The `Mapper` object to use for mapping entities to presentation models.
   * @param {FindOneUseCase<E>} findOne - The `FindOneUseCase` object to use for finding the entity.
   */
  constructor (
    private readonly entityToPresentationModelMapper: Mapper<E, P>,
    private readonly findOne: FindOneUseCase<E>
  ) {}

  /**
   * Handles a request to find an entity by its ID.
   * @param {string} id - The ID of the entity to find.
   * @returns {Promise<HttpResponse<string | P>>} A `Promise` that resolves to an `HttpResponse` object.
   */
  async handle (id: string): Promise<HttpResponse<string | P>> {
    const result = await this.findOne.execute(id)
    return result instanceof Error ? notFound(result.message) : ok(await this.entityToPresentationModelMapper.execute(result))
  }
}
