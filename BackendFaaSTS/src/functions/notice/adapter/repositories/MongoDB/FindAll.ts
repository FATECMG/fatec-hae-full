import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindAllEntityRepository } from '@common/repository/RepositoryInterface'
import { toDomain } from '@common/utils/mongo/MongoMapperUtils'

import { type Notice } from '@functions/notice/entities'
import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'

import { injectable } from 'inversify'

@injectable()
export default class FindAllNoticeMongoRepository implements FindAllEntityRepository<Notice> {
  async perform (active: boolean): Promise<Notice[]> {
    await connectDatabase()
    const result = await NoticeModel.find({ active })
    return result.map(eachDoc => toDomain<Notice>(eachDoc))
  }
}
