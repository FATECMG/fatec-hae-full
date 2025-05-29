import { ValidationError, type FieldError } from '@common/error/ValidationError'
import { type HttpResponse } from '@common/http/Types'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { TransformerComposite } from '@common/utils/transformer/TransformerComposite'
import { TransformerBuilder } from '@common/utils/transformer/TransformerBuilder'
import { SaveUseCase } from '@common/domain/UseCase.interface'
import { Mapper } from '@common/mapper/BaseMapper'
import { badRequest, created, notFound, serverError, serviceUnavailable, unauthorized, unauthenticated } from '@common/http/Helpers'
import { NewValidationSchema } from '@common/validation/Validate'

import { injectable } from 'inversify'
import { NotFoundError } from '@common/error/NotFoundError'
import { MailAuthError, MailError } from '@common/error/EmailError'
import { DateError } from '@common/error/InvalidDate'
import { AuthenticationError } from '@common/error/AuthenticationError'
import { AuthorizationError } from '@common/error/AuthorizationError'

/**
 * An abstract controller class that handles requests to save an entity.
 * @template T - The type of the DTO object to receive from the client.
 * @template E - The type of the entity to save.
 * @template P - The type of the presentation model to return.
 */
@injectable()
export default abstract class SaveController<T, E, P> {
  private readonly transformers: TransformerComposite

  /**
   * Creates a new instance of the `SaveController` class.
   * @param {NewValidationSchema} dtoValidator - The `NewValidationSchema` object to use for validating the DTO object.
   * @param {Mapper<T, E>} dtoToEntityMapper - The `Mapper` object to use for mapping the DTO object to an entity.
   * @param {Mapper<E, P>} entityToPresentationModelMapper - The `Mapper` object to use for mapping the entity to a presentation model.
   * @param {SaveUseCase<E>} entityUseCase - The `SaveUseCase` object to use for saving the entity.
   */
  constructor (
    private readonly dtoValidator: NewValidationSchema,
    private readonly dtoToEntityMapper: Mapper<T, E>,
    private readonly entityToPresentationModelMapper: Mapper<E, P>,
    private readonly entityUseCase: SaveUseCase<E>
  ) {
    this.transformers = this.buildTransformers()
  }

  /**
   * Handles a request to save an entity.
   * @param {T} object - The DTO object to receive from the client.
   * @returns {Promise<HttpResponse<FieldError[] | FieldError | string | P >>} A `Promise` that resolves to an `HttpResponse` object.
   */
  async handle (object: T): Promise<HttpResponse<FieldError[] | FieldError | string | P >> {
    const validationResult = this.dtoValidator.validate(object)
    if (validationResult !== undefined) {
      return badRequest(validationResult.errors)
    }
    const param = this.transformers.execute(await this.dtoToEntityMapper.execute(object))
    try {
      const result = await this.entityUseCase.execute(param)
      if (result instanceof Error) {
        if (result instanceof ValidationError) {
          return badRequest(result.errors)
        }
        if (result instanceof DuplicatedFieldError) {
          return badRequest({ field: result.field, message: result.message })
        }
        if (result instanceof NotFoundError) {
          return notFound({ field: result.field, message: result.message })
        }
        if (result instanceof MailError || result instanceof MailAuthError) {
          return serviceUnavailable({ field: result.field, message: result.message })
        }
        if (result instanceof DateError) {
          return badRequest({ field: result.field, message: result.message })
        }
        if (result instanceof AuthenticationError) {
          return unauthenticated({ field: result.field, message: result.message })
        }
        if (result instanceof AuthorizationError) {
          return unauthorized(result.message)
        }
      } else {
        return created(await this.entityToPresentationModelMapper.execute(result))
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
