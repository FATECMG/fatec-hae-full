import { type SaveEntityRepository } from '@common/repository/RepositoryInterface'
import { connectDatabase } from '@common/external/database/MongoDB'
import { isMongoDuplicationError } from '@common/utils/mongo/MongoErrorUtils'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { toDomain } from '@common/utils/mongo/MongoMapperUtils'
import { EntityNotFoundByNameError, NotFoundError } from '@common/error/NotFoundError'

import { type Notice } from '@functions/notice/entities'
import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'
import { errorLabel } from '@functions/notice/adapter/repositories/MongoDB/utils/errorLabel'

import { injectable } from 'inversify'

type PossibleDuplicatedFields = 'title'
const possibleDuplicatedFields: PossibleDuplicatedFields = 'title'
let entityFromDatabase: Notice

@injectable()
export default class SaveNoticeMongoRepository implements SaveEntityRepository<Notice> {
  async perform (entity: Notice): Promise<Notice> {
    try {
      // TODO: adicionar verificação de existência de curso
      await connectDatabase()
      entityFromDatabase = toDomain(await NoticeModel.create(entity))
    } catch (error) {
      if (isMongoDuplicationError(error)) {
        throw new DuplicatedFieldError({
          mongoError: error,
          errorLabel,
          entity,
          possibleDuplicatedFields
        })
      }
      if (error instanceof NotFoundError) {
        throw new EntityNotFoundByNameError(error.fieldValue, error.entityName)
      }
      throw new Error('Erro inesperado ao criar edital!')
    }
    return entityFromDatabase
  }
}
