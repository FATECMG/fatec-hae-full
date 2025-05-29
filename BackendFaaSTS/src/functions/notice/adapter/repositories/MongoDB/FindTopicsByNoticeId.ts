import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindOneEntityRepository } from '@common/repository/RepositoryInterface'

import { type NoticeTopicsOfInterest } from '@functions/notice/entities'
import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'

import { injectable } from 'inversify'

@injectable()
export default class FindTopicsByNoticeIdMongoRepository implements FindOneEntityRepository<NoticeTopicsOfInterest> {
  async perform (id: string): Promise<NoticeTopicsOfInterest | undefined> {
    await connectDatabase()
    const result = await NoticeModel.findOne({ active: true, id }, { topicsOfInterest: 1 })
    return result === null ? undefined : { topicsOfInterest: result.topicsOfInterest }
  }
}
