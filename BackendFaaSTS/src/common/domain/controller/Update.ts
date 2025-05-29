import { badRequest, notFound, ok, serverError } from '@common/http/Helpers'
import { NotFoundError } from '@common/error/NotFoundError'
import { Mapper } from '@common/mapper/BaseMapper'
import { UpdateUseCase } from '@common/domain/UseCase.interface'
import { type HttpResponse } from '@common/http/Types'
import { ValidationError, type FieldError } from '@common/error/ValidationError'
import { NewValidationSchema } from '@common/validation/Validate'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { TransformerBuilder } from '@common/utils/transformer/TransformerBuilder'
import { TransformerComposite } from '@common/utils/transformer/TransformerComposite'
import { injectable } from 'inversify'
import { DateError } from '@common/error/InvalidDate'

/**
 * An abstract controller class that handles requests to update an entity by its ID.
 * @template T - The type of the DTO object to receive from the client.
 * @template E - The type of the entity to update.
 * @template P - The type of the presentation model to return.
 */
@injectable()
export default abstract class UpdateController<T, E, P> {
  private readonly transformers: TransformerComposite
  /**
   * Creates a new instance of the `UpdateController` class.
   * @param {NewValidationSchema} dtoValidator - The `NewValidationSchema` object to use for validating the DTO object.
   * @param {Mapper<T, E>} dtoToEntityMapper - The `Mapper` object to use for mapping the DTO object to an entity.
   * @param {Mapper<E, P>} entityToPresentationModelMapper - The `Mapper` object to use for mapping the entity to a presentation model.
   * @param {UpdateUseCase<E>} entityUseCase - The `UpdateUseCase` object to use for updating the entity.
   */
  constructor (
    private readonly dtoValidator: NewValidationSchema,
    private readonly dtoToEntityMapper: Mapper<T, E>,
    private readonly entityToPresentationModelMapper: Mapper<E, P>,
    private readonly entityUseCase: UpdateUseCase<E>
  ) {
    this.transformers = this.buildTransformers()
  }

  /**
   * Handles a request to update an entity by its ID.
   * @param {T} dto - The DTO object to receive from the client.
   * @param {string} id - The ID of the entity to update.
   * @returns {Promise<HttpResponse<FieldError[] | FieldError | string | P>>} A `Promise` that resolves to an `HttpResponse` object.
   */
  async handle (dto: T, id: string): Promise<HttpResponse<FieldError[] | FieldError | string | P>> {
    const validationResult = this.dtoValidator.validate(dto)
    if (validationResult !== undefined) {
      return badRequest(validationResult.errors)
    }
    const param = this.transformers.execute(await this.dtoToEntityMapper.execute(dto))
    try {
      const result = await this.entityUseCase.execute(id, param)
      if (result instanceof Error) {
        if (result instanceof DuplicatedFieldError) {
          return badRequest({ field: result.field, message: result.message })
        }
        if (result instanceof NotFoundError) {
          return notFound({ field: result.field, message: result.message })
        }
        if (result instanceof DateError) {
          return badRequest({ field: result.field, message: result.message })
        }
        if (result instanceof ValidationError) {
          return badRequest(result.errors)
        }
      } else {
        return ok(await this.entityToPresentationModelMapper.execute(result))
      }
      return serverError(new Error('Erro inesperado!'))
    } catch (err) {
      return serverError(new Error('Erro inesperado!'))
    }
  }

  /**
 * Builds a composite transformer that applies a series of transformations to a string.
 * @returns {TransformerComposite} A `TransformerComposite` object that applies the transformations.
 */
  private buildTransformers (): TransformerComposite {
    return new TransformerComposite(TransformerBuilder.of()
      .emojiParser()
      .stringTrimmer()
      .spaceNormalizer()
      .build()
    )
  }
}
