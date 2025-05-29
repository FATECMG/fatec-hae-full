import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'
import { type Project } from '@functions/project/entities/Project'
import { AuthenticatorLocator } from '@functions/auth/shared/Di.enums'
import { ProjectMapperLocator, ProjectUseCaseLocator } from '@functions/project/shared/Di.enums'
import { UpdateProjectStatusUseCase } from '@functions/project/useCases/UpdateStatus'

import { injectable, inject } from 'inversify'
import { UpdateStatusController } from '@common/domain/Controllers'
import { CognitoAuthenticationService } from '@common/auth/cognito/CognitoAuthenticationService'
import { Mapper } from '@common/mapper/BaseMapper'

@injectable()
export class HandleUpdateProjectStatusController extends UpdateStatusController<Project, ProjectPM> {
  constructor (
    @inject(ProjectUseCaseLocator.UpdateProjectStatusUseCase) updateStatus: UpdateProjectStatusUseCase,
    @inject(ProjectMapperLocator.ProjectPresentationModelMapper) entityToPresentationModelMapper: Mapper<Project, ProjectPM>,
    @inject(AuthenticatorLocator.CognitoAuthenticationService) authService: CognitoAuthenticationService
  ) {
    super(updateStatus, entityToPresentationModelMapper, authService)
  }
  
}
