import { Mapper } from '@common/mapper/BaseMapper'
import { FindAllUseCase, FindOneUseCase } from '@common/domain/UseCase.interface'

import { NoticeMapperLocator, NoticeUseCaseLocator } from '@functions/notice/shared/Di.enums'
import { type Notice, type NoticePM } from '@functions/notice/entities'

import { inject, injectable } from 'inversify'
import { AuthenticatorLocator } from '@functions/auth/shared/Di.enums'
import { AuthenticationService } from '@common/auth/AuthenticationService.interface'
import { IDNotFoundError } from '@common/error/NotFoundError'
import { User } from '@functions/user/entities/User'
import { UserLocator } from '@functions/user/shared/Di.enums'
import { Role } from '@functions/role/entities/Role'
import { HttpResponse } from '@common/http/Types'
import { badRequest, ok, serverError } from '@common/http/Helpers'

@injectable()
export default class FindAllNoticeController {
  constructor (
    @inject(NoticeMapperLocator.NoticePresentationModelMapper) readonly PMFromEntity: Mapper<Notice, NoticePM>,
    @inject(NoticeUseCaseLocator.NoticeFindAllUseCase) readonly findAllUseCase: FindAllUseCase<Notice>,
    @inject(UserLocator.UserFindOneUseCase) private readonly findOneUser: FindOneUseCase<User>,
    @inject(AuthenticatorLocator.CognitoAuthenticationService) private readonly authService: AuthenticationService
  ) {}

  async handle (token: string, active: boolean): Promise<HttpResponse<NoticePM[] | string>> {
    try{
        const { courses, roles } = await this.getUserByToken(token)  
        
        const coursesIds = courses.map(eachCourse => eachCourse.id)

        let notices: NoticePM[]
        const presentation = []

        if (Role.isRestricted(roles)) {
          notices = await this.getNoticesByUserCourses(coursesIds)
        }else{
          notices = await this.findAllUseCase.execute(active)
        }
        
        for (const resource of notices) {
          presentation.push(await this.PMFromEntity.execute(resource))
        }
        

        return ok(presentation)
    }catch (error) {
        
      if (error instanceof IDNotFoundError) {
          return badRequest('Houve um erro com a autenticação!')
        }
        
        return serverError(error as Error)
      } 
  }

  private async getUserByToken (token: string): Promise<User> {
    const userData = await this.authService.getUserByToken({ accessToken: token })

    if (userData === undefined || userData instanceof Error) {
      throw new IDNotFoundError('invalid_id', 'user')
    }
    if (userData.id === undefined) {
      throw new IDNotFoundError('invalid_id', 'user')
    }
    const user = await this.findOneUser.execute(userData.id)
    if (user instanceof Error) {
      throw new IDNotFoundError(userData.id, 'user')
    }
    return user
  }

    private async getNoticesByUserCourses (courses: string[]): Promise<Notice[]> {
      const notices = await this.findAllUseCase.execute(true)
      const noticesFiltered = this.filterNoticesFromErrors(notices)
      
      return noticesFiltered
        .filter(eachNotice => (eachNotice.course !== undefined) && courses.includes(eachNotice.course.id))
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

}
