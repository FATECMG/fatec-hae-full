import { SaveUseCase } from '@common/domain/UseCase.interface'
import { Mapper } from '@common/mapper/BaseMapper'
import { NewValidationSchema } from '@common/validation/Validate'

import { badRequest, created, notFound, serverError, serviceUnavailable } from '@common/http/Helpers'
import { type HttpResponse } from '@common/http/Types'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { NotFoundError } from '@common/error/NotFoundError'
import { type FieldError, ValidationError } from '@common/error/ValidationError'
import { MailAuthError, MailError } from '@common/error/EmailError'
import { AuthenticationError } from '@common/error/AuthenticationError'
import { DateError } from '@common/error/InvalidDate'
import { ResourceError } from '@common/error/ResourceError'

import { type ReportDTO } from '../entities/dto/ReportDTO'
import { type Report } from '../entities/Report'
import { type ReportPM } from '../entities/pm/ReportPM'

import { ReportMapperLocator, ReportSchemaValidationLocator, ReportUseCaseLocator } from '../shared/Di.enums'

import { inject, injectable } from 'inversify'
import { TransformerComposite } from '@common/utils/transformer/TransformerComposite'
import { TransformerBuilder } from '@common/utils/transformer/TransformerBuilder'
import { ReportError } from '@common/error/ReportError'

@injectable()
export class HandleSaveReportController {
  private readonly transformers: TransformerComposite

  constructor (
    @inject(ReportUseCaseLocator.SaveReportUseCase) private readonly saveUseCase: SaveUseCase<Report>,
    @inject(ReportSchemaValidationLocator.ReportDTONewValidationSchema) private readonly dtoValidator: NewValidationSchema,
    @inject(ReportMapperLocator.ReportPresentationModelMapper) private readonly PMFromEntity: Mapper<Report, ReportPM>
  ) {
    this.transformers = this.buildTransformers()
  }

  async handle (params: ReportDTO, token: string): Promise<HttpResponse<FieldError[] | FieldError | string | ReportPM >> {
    const validationResult = this.dtoValidator.validate(params)
    if (validationResult !== undefined) {
      return badRequest(validationResult.errors)
    }
    const param = this.transformers.execute({ ...params, token })

    try {
      const result = await this.saveUseCase.execute(param)
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
          return badRequest({ field: result.field, message: result.message })
        }
        if (result instanceof ResourceError) {
          return badRequest(result.message)
        }
        if (result instanceof ReportError) {
          return serverError(result)
        }
      } else {
        return created(await this.PMFromEntity.execute(result))
      }
      return serverError(new Error('Erro inesperado!'))
    } catch (err) {
      return serverError(new Error('Erro inesperado!'))
    }
  }

  private buildTransformers (): TransformerComposite {
    return new TransformerComposite(TransformerBuilder.of()
      .emojiParser()
      .stringTrimmer()
      .spaceNormalizer()
      .build()
    )
  }
}
