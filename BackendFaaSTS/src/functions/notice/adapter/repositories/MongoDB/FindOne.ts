import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindOneEntityRepository } from '@common/repository/RepositoryInterface'
import { toDomain } from '@common/utils/mongo/MongoMapperUtils'

import { type Notice } from '@functions/notice/entities'
import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'

import { injectable } from 'inversify'

@injectable()
export default class FindOneNoticeMongoRepository implements FindOneEntityRepository<Notice> {
  async perform (id: string): Promise<Notice | undefined> {
    await connectDatabase()
    const result = await NoticeModel.findOne({ id })
    return result === null ? undefined : toDomain<Notice>(result)
  }
}
