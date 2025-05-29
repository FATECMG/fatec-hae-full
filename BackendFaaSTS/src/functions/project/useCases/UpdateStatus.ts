import { FindOneEntityRepository } from '@common/repository/RepositoryInterface'
import { IDNotFoundError } from '@common/error/NotFoundError'
import { StatusNotUpdated, StatusNotValid, StatusNotValidChange } from '@common/error/StatusError'
import { InfraError } from '@common/error/InfraError'
import { createStandardFormatDate } from '@common/utils/date/createStandardFormatDate'
import { DateValidationOption, validateDate } from '@common/utils/date/validateDate'
import { InvalidRangeDate } from '@common/error/InvalidDate'

import { UpdateStatusUseCase, UpdateStatusUseCaseProps } from '@common/domain/UseCase.interface'
import { UpdateStatusRepository } from '@functions/project/adapter/repositories/MongoDB/UpdateStatus'
import { ProjectRepositoryLocator } from '@functions/project/shared/Di.enums'
import { type Project } from '@functions/project/entities/Project'
import { Status } from '@functions/project/entities/enums/ProjectEnums'
import { type Notice } from '@functions/notice/entities'
import { NoticeRepositoryLocator } from '@functions/notice/shared/Di.enums'
import { Role } from '@functions/role/entities/Role'
import { StatusUtil } from '@common/utils/status/StatusUtil'

import { inject, injectable } from 'inversify'



@injectable()
export class UpdateProjectStatusUseCase implements UpdateStatusUseCase<Project>{
  constructor (
    @inject(ProjectRepositoryLocator.UpdateStatusRepository) private readonly updateStatus: UpdateStatusRepository,
    @inject(ProjectRepositoryLocator.FindOneProjectRepository) private readonly findOne: FindOneEntityRepository<Project>,
    @inject(NoticeRepositoryLocator.NoticeFindOneRepository) private readonly findNotice: FindOneEntityRepository<Notice>
  ) {}

  async execute (props: UpdateStatusUseCaseProps): Promise<Project | Error> {
    try {
      const project = await this.findProjectOrThrowError(props.id)

      StatusUtil.validateStatus(props.status)

      const sendDate = this.createSendDate(props.status)
      const isRestricted = Role.isRestricted(props.role)

      if (isRestricted) {
        StatusUtil.throwErrorIfInvalidStatusChange(project.status, props.status)
        await this.throwErrorIfSendDateIsAfterCloseDate(project.notice.id, sendDate ?? project.sendDate)
      }

      project.sendDate = project.sendDate !== undefined ? project.sendDate : sendDate
      project.status = props.status
      const result = await this.updateStatus.perform(props.id, props.status, sendDate ?? project.sendDate)

      if (!result) throw new StatusNotUpdated()

      return project
    } catch (error) {
      if (error instanceof IDNotFoundError) {
        return new IDNotFoundError(error.id, 'Projeto')
      }

      if (error instanceof StatusNotValid) {
        return new StatusNotValid()
      }

      if (error instanceof StatusNotValidChange) {
        return new StatusNotValidChange()
      }

      if (error instanceof StatusNotUpdated) {
        return new StatusNotUpdated()
      }
      if (error instanceof InvalidRangeDate) {
        return new InvalidRangeDate(error.field, error.message)
      }
    }

    return new InfraError('Erro inesperado!')
  }

  private createSendDate (status: string): string | undefined {
    return status === Status.SENT ? createStandardFormatDate(new Date()) : undefined
  }

  private async findProjectOrThrowError (id: string): Promise<Project> {
    const project = await this.findOne.perform(id)
    if (project == null) throw new IDNotFoundError(id, 'Projeto')
    return project
  }

  private async throwErrorIfSendDateIsAfterCloseDate (noticeId: string, sendDate?: string): Promise<void> {
    if (sendDate === undefined) return

    const notice = await this.findNotice.perform(noticeId)

    if (notice === undefined) {
      throw new IDNotFoundError(noticeId, 'edital')
    }

    validateDate({ date: sendDate, targetDate: notice.closeDate, option: DateValidationOption.IS_AFTER })
  }
}
