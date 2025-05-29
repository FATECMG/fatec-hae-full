import { Report } from '../entities/Report'
import { ReportRepositoryLocator } from '../shared/Di.enums'
import { FindOneEntityRepository, SaveEntityRepository } from '@common/repository/RepositoryInterface'
import { InfraError } from '@common/error/InfraError'

import { inject, injectable } from 'inversify'
import { ProjectRepositoryLocator } from '@functions/project/shared/Di.enums'
import { type Project } from '@functions/project/entities/Project'
import { IDNotFoundError, NotFoundError } from '@common/error/NotFoundError'
import { UserLocator } from '@functions/user/shared/Di.enums'
import { type User } from '@functions/user/entities/User'
import { Activity, type ActivityProps } from '../entities/Activity'
import { AuthenticatorLocator } from '@functions/auth/shared/Di.enums'
import { CognitoAuthenticationService } from '@common/auth/cognito/CognitoAuthenticationService'
import { Status } from '@functions/project/entities/enums/ProjectEnums'
import { AuthorizationError } from '@common/error/AuthorizationError'
import { ReportError } from '@common/error/ReportError'
import { ResourceError, UnableToCreateResourceError } from '@common/error/ResourceError'
import { NoticeRepositoryLocator } from '@functions/notice/shared/Di.enums'
import { type Notice } from '@functions/notice/entities'

export interface CreateReportUseCaseProps {
  token: string
  projectId: string
  activities: ActivityProps[]
}

@injectable()
export class UpdateReportUseCase {
  constructor (
    @inject(ReportRepositoryLocator.SaveReportRepository) private readonly saveReport: SaveEntityRepository<Report>,
    @inject(ProjectRepositoryLocator.FindOneProjectRepository) private readonly findOneProject: FindOneEntityRepository<Project>,
    @inject(UserLocator.UserFindOneRepository) private readonly findOneUser: FindOneEntityRepository<User>,
    @inject(AuthenticatorLocator.CognitoAuthenticationService) private readonly authService: CognitoAuthenticationService,
    @inject(NoticeRepositoryLocator.NoticeFindOneRepository) private readonly findNotice: FindOneEntityRepository<Notice>,
    @inject(ReportRepositoryLocator.FindOneReportByProjectIdRepository) private readonly findOneReport: FindOneEntityRepository<Report>
  ) {}

  async execute (props: CreateReportUseCaseProps): Promise<Report | Error> {
    try {
      if (props.activities.length === 0 || props.activities === undefined) { throw new ReportError('Relatório deve conter pelo menos uma atividade!') }

      const entity = await this.createReport(props)

      const result = await this.saveReport.perform(entity)

      return result
    } catch (error) {
      return error as Error
    }
  }

  private async getUserByToken (token: string): Promise<User> {
    const userData = await this.authService.getUserByToken({ accessToken: token })
    if (userData.id === undefined) {
      throw new IDNotFoundError('invalid_id', 'user')
    }
    const user = await this.findOneUser.perform(userData.id)
    if (user == null) {
      throw new IDNotFoundError('invalid_id', 'user')
    }
    return user
  }

  private async getProjectById (id: string): Promise<Project> {
    const project = await this.findOneProject.perform(id)
    if (project == null) {
      throw new IDNotFoundError('invalid_id', 'project')
    }

    await this.isProjectApproved(project)

    await this.isProjectActive(project)

    return project
  }

  //   private async isUserProjectAuthor (user: User, project: Project): Promise<boolean> {
  //     if (user.id === project.author.id) {
  //       return true
  //     }

  //     throw new NotAuthorizedToCreateResourceError('Usuário não tem permissão para criar relatório para este projeto!')
  //   }

  private async isProjectActive (project: Project): Promise<boolean> {
    if (project.active) {
      return true
    }

    throw new UnableToCreateResourceError('Projeto não existe!')
  }

  private async isProjectApproved (project: Project): Promise<boolean> {
    if (project.status === Status.APPROVED) {
      return true
    }

    throw new UnableToCreateResourceError('Projeto ainda não foi aprovado!')
  }

  private async getProjectCourse (project: Project): Promise<string> {
    const notice = await this.findNotice.perform(project.notice.id)

    if (notice == null) {
      throw new IDNotFoundError('invalid_id', 'notice')
    }

    if (notice.course === undefined) {
      throw new IDNotFoundError('invalid_id', 'notice')
    }

    return notice.course.id
  }

  private async createReport (props: CreateReportUseCaseProps): Promise<Report> {
    try {
      const project = await this.getProjectById(props.projectId)

      await this.getUserByToken(props.token)

      const projectCourse = await this.getProjectCourse(project)

      //   await this.isUserProjectAuthor(user, project)

      const entity = new Report({
        author: {
          id: project.author.id,
          name: project.author.name
        },
        course: projectCourse,
        active: true,
        project: {
          id: project.id,
          title: project.title
        },
        activities: props.activities.map(activity =>
          new Activity({
            description: activity.description.toLocaleUpperCase()
          })
        ),
        status: Status.DRAFT
      })

      const reportExists = await this.findOneReport.perform(project.id)

      if (reportExists !== undefined) {
        entity.id = reportExists.id
        entity.status = reportExists.status
        entity.active = reportExists.active
      }

      return entity
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }

      if (error instanceof AuthorizationError) {
        throw error
      }

      if (error instanceof ResourceError) {
        throw error
      }

      throw new InfraError('Erro inesperado!')
    }
  }
}
