import { connectDatabase } from '@common/external/database/MongoDB'
import { type UpdateEntityRepository } from '@common/repository/RepositoryInterface'
import { toDomain } from '@common/utils/mongo/MongoMapperUtils'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { isMongoDuplicationError } from '@common/utils/mongo/MongoErrorUtils'
import { EntityNotFoundByNameError, NotFoundError } from '@common/error/NotFoundError'

import { type Notice } from '@functions/notice/entities'
import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'
import { errorLabel } from '@functions/notice/adapter/repositories/MongoDB/utils/errorLabel'

import { injectable } from 'inversify'

type PossibleDuplicatedFields = 'title'
const possibleDuplicatedFields: PossibleDuplicatedFields = 'title'

@injectable()
export default class UpdateNoticeMongoRepository implements UpdateEntityRepository<Notice> {
  async perform (notice: Notice, id: string): Promise<Notice | undefined> {
    await connectDatabase()
    try {
      // TODO: adicionar verificação de existência de curso
      const updatedNotice = await NoticeModel.findOneAndUpdate({ id }, {
        $set: {
          title: notice.title,
          description: notice.description,
          openDate: notice.openDate,
          closeDate: notice.closeDate,
          semester: notice.semester,
          year: notice.year,
          topicsOfInterest: notice.topicsOfInterest,
          evaluationEndDate: notice.evaluationEndDate,
          course: notice.course,
          active: notice.active
        }
      }, { new: true, runValidators: true })
      return updatedNotice === null ? undefined : toDomain<Notice>(updatedNotice)
    } catch (error) {
      if (isMongoDuplicationError(error)) {
        throw new DuplicatedFieldError({
          mongoError: error,
          errorLabel,
          entity: notice,
          possibleDuplicatedFields
        })
      }
      if (error instanceof NotFoundError) {
        throw new EntityNotFoundByNameError(error.fieldValue, error.entityName)
      }
      throw new Error('Erro inesperado ao atualizar edital!')
    }
  }
}
