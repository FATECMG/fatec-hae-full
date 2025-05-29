import { FindOneUseCase, UpdateUseCase } from '@common/domain/UseCase.interface'
import { Mapper } from '@common/mapper/BaseMapper'
import { NewValidationSchema } from '@common/validation/Validate'

import { ProjectMapperLocator, ProjectSchemaValidationLocator, ProjectUseCaseLocator } from '@functions/project/shared/Di.enums'
import { type Project } from '@functions/project/entities/Project'
import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'

import { inject, injectable } from 'inversify'
import { type ProjectUpdateDTO } from '../entities/dto/ProjectUpdateDTO'
import { type HttpResponse } from '@common/http/Types'
import { type FieldError, ValidationError } from '@common/error/ValidationError'
import { badRequest, notFound, ok, serverError, unauthenticated, unauthorized } from '@common/http/Helpers'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { IDNotFoundError, NotFoundError } from '@common/error/NotFoundError'
import { DateError } from '@common/error/InvalidDate'
import { TransformerComposite } from '@common/utils/transformer/TransformerComposite'
import { TransformerBuilder } from '@common/utils/transformer/TransformerBuilder'
import { AuthenticatorLocator } from '@functions/auth/shared/Di.enums'
import { CognitoAuthenticationService } from '@common/auth/cognito/CognitoAuthenticationService'
import { RoleEnum, type User } from '@functions/user/entities/User'
import { UserLocator } from '@functions/user/shared/Di.enums'
import { AuthorizationError, NotAuthorizedToModifyResourceError } from '@common/error/AuthorizationError'
import { AuthenticationError } from '@common/error/AuthenticationError'

@injectable()
export class HandleUpdateProjectController {
  private readonly transformers: TransformerComposite
  constructor (
    @inject(ProjectUseCaseLocator.UpdateProjectUseCase)
    private readonly updateUseCase: UpdateUseCase<Project>,

    @inject(ProjectSchemaValidationLocator.ProjectDTOUpdateNewValidationSchema)
    private readonly dtoValidator: NewValidationSchema,

    @inject(ProjectMapperLocator.ProjectUpdateMapper)
    private readonly entityFromDTOMapper: Mapper<ProjectUpdateDTO, Project>,

    @inject(ProjectMapperLocator.ProjectPresentationModelMapper)
    private readonly PMFromEntity: Mapper<Project, ProjectPM>,

    @inject(AuthenticatorLocator.CognitoAuthenticationService)
    private readonly authService: CognitoAuthenticationService,

    @inject(ProjectUseCaseLocator.FindOneProjectUseCase)
    private readonly findOneProjectUseCase: FindOneUseCase<Project>,

    @inject(UserLocator.UserFindOneUseCase)
    private readonly findOneUserUseCase: FindOneUseCase<User>

  ) {
    this.transformers = this.buildTransformers()
  }

  async handle (dto: ProjectUpdateDTO, id: string, token: string): Promise<HttpResponse<FieldError[] | FieldError | string | ProjectPM>> {
    const validationResult = this.dtoValidator.validate(dto)
    if (validationResult !== undefined) {
      return badRequest(validationResult.errors)
    }
    const param = this.transformers.execute(await this.entityFromDTOMapper.execute(dto))
    try {
      await this.validateUpdate(id, token)

      const result = await this.updateUseCase.execute(id, param)
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
        return ok(await this.PMFromEntity.execute(result))
      }
      return serverError(new Error('Erro inesperado!'))
    } catch (err) {
      if (err instanceof AuthorizationError) {
        return unauthorized(err.message)
      }

      if (err instanceof AuthenticationError) {
        return unauthenticated(err)
      }

      return serverError(new Error('Erro inesperado!'))
    }
  }

  private async validateUpdate (id: string, token: string): Promise<void> {
    const user = await this.getUserByToken(token)
    const project = await this.findOneProjectUseCase.execute(id)
    if (project instanceof Error) {
      throw new IDNotFoundError(id, 'projeto')
    }
    await this.validateUserPermission(user, project)
  }

  private async getUserByToken (token: string): Promise<User> {
    const userData = await this.authService.getUserByToken({ accessToken: token })
    if (userData.id === undefined) {
      throw new IDNotFoundError('invalid_id', 'user')
    }
    const user = await this.findOneUserUseCase.execute(userData.id)
    if (user instanceof Error) {
      throw new IDNotFoundError(userData.id, 'user')
    }
    return user
  }

  private async validateUserPermission (user: User, project: Project): Promise<void> {
    if (this.userIsNotDirector(user.roles)) {
      if (this.isThisUserNotAuthor(user.id, project.author.id)) {
        throw new NotAuthorizedToModifyResourceError('projeto')
      }
    }
  }

  private isThisUserAuthor (userId: string, authorId: string): boolean {
    return userId === authorId
  }

  private isThisUserNotAuthor (userId: string, authorId: string): boolean {
    return !this.isThisUserAuthor(userId, authorId)
  }

  private userIsDirector (roles: string): boolean {
    return (roles === RoleEnum.DIRECTOR || roles === RoleEnum.ACADEMICDIRECTOR)
  }

  private userIsNotDirector (roles: string): boolean {
    return !this.userIsDirector(roles)
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
