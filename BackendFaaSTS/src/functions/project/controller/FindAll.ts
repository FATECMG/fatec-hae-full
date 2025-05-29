import { Mapper } from '@common/mapper/BaseMapper'
import { FindAllWithFilterUseCase, FindOneUseCase } from '@common/domain/UseCase.interface'
import { type HttpResponse } from '@common/http/Types'
import { badRequest, ok, serverError } from '@common/http/Helpers'
import { CognitoAuthenticationService } from '@common/auth/cognito/CognitoAuthenticationService'
import { IDNotFoundError } from '@common/error/NotFoundError'

import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'
import { type Project } from '@functions/project/entities/Project'
import { ProjectMapperLocator, ProjectUseCaseLocator } from '@functions/project/shared/Di.enums'
import { type ProjectFilter } from '@functions/project/adapter/external/web/filter/ProjectFilter'
import { AuthenticatorLocator } from '@functions/auth/shared/Di.enums'
import { RoleEnum, type User } from '@functions/user/entities/User'
import { UserLocator } from '@functions/user/shared/Di.enums'
import { NoticeUseCaseLocator } from '@functions/notice/shared/Di.enums'
import { type Notice } from '@functions/notice/entities'

import { inject, injectable } from 'inversify'

@injectable()
export class FindAllProjectController {
  constructor (
    @inject(ProjectMapperLocator.ProjectPresentationModelMapper) private readonly PMFromEntity: Mapper<Project, ProjectPM>,
    @inject(ProjectUseCaseLocator.FindAllProjectUseCase) private readonly findAllUseCase: FindAllWithFilterUseCase<Project, ProjectFilter>,
    @inject(UserLocator.UserFindOneUseCase) private readonly findUserById: FindOneUseCase<User>,
    @inject(NoticeUseCaseLocator.NoticeFindOneUseCase) private readonly findNoticeById: FindOneUseCase<Notice>,
    @inject(AuthenticatorLocator.CognitoAuthenticationService) private readonly authService: CognitoAuthenticationService
  ) { }

  async handle (params: ProjectFilter, token: string): Promise<HttpResponse<ProjectPM[] | string>> {
    try {
      const userData = await this.getUserByToken(token)
      const userCourses = this.getCoursesIdByUser(userData)
      const projects = await this.findAllUseCase.execute(params)
      let presentation = []
      for (const resource of projects) {
        presentation.push(await this.PMFromEntity.execute(resource))
      }
      if (presentation.length > 0 && this.userIsNotDirector(userData.roles)) {
        const notices = await this.getNoticesByUserCourses(userCourses, presentation)
        presentation = this.filterProjectsByCourses(notices, presentation)
        presentation = this.filterProjectToNotSentOwnProjects(userData.id, presentation)
      }
      return ok(presentation)
    } catch (error) {
      if (error instanceof IDNotFoundError) {
        return badRequest('Houve um erro com a autenticação!')
      }
      return serverError(error as Error)
    }
  }

  private async getUserByToken (token: string): Promise<User> {
    const userData = await this.authService.getUserByToken({ accessToken: token })
    if (userData.id === undefined) {
      throw new IDNotFoundError('invalid_id', 'user')
    }
    const user = await this.findUserById.execute(userData.id)
    if (user instanceof Error) {
      throw new IDNotFoundError(userData.id, 'user')
    }
    return user
  }

  private getCoursesIdByUser (user: User): string[] {
    return user.courses.map(eachCourse => eachCourse.id)
  }

  private userIsNotDirector (roles: string): boolean {
    return !(roles === RoleEnum.DIRECTOR || roles === RoleEnum.ACADEMICDIRECTOR)
  }

  private async getNoticesByUserCourses (courses: string[], allProjects: Project[]): Promise<string[]> {
    const noticesId = allProjects.map(eachProject => eachProject.notice.id)
    const values = await this.getNoticeByIds(noticesId)
    const notices: any[] = this.filterNoticesFromErrors(values)
    return notices
      .filter(eachNotice => (eachNotice.course !== undefined) && courses.includes(eachNotice.course.id))
      .map(eachNotice => eachNotice.id)
  }

  private async getNoticeByIds (noticesId: string[]): Promise<Array<Notice | Error>> {
    return await Promise.all(noticesId.map(async eachNotice => await this.findNoticeById.execute(eachNotice)))
  }

  private filterNoticesFromErrors (values: Array<Notice | Error>): Notice[] {
    const notices = []
    for (const value of values) {
      if (value instanceof Error) {
        throw new IDNotFoundError('invalid_id', 'notice')
      }
      notices.push(value)
    }
    return notices
  }

  private filterProjectsByCourses (notices: string[], projects: ProjectPM[]): ProjectPM[] {
    return projects.filter(eachProject => notices.includes(eachProject.notice.id))
  }

  private filterProjectToNotSentOwnProjects (userId: string, projects: ProjectPM[]): ProjectPM[] {
    return projects.filter(eachProject => eachProject.author.id !== userId)
  }
}
