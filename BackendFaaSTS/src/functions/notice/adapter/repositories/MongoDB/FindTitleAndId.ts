import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindAllEntityRepository } from '@common/repository/RepositoryInterface'

import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'
import { type NoticeTitleAndId } from '@functions/notice/entities'

import { injectable } from 'inversify'

@injectable()
export default class FindAllNoticeTitleAndIdMongoRepository implements FindAllEntityRepository<NoticeTitleAndId> {
  async perform (active: boolean): Promise<NoticeTitleAndId[]> {
    await connectDatabase()
    const result = await NoticeModel.find({ active }, { title: 1, id: 1, _id: 0 })
    return result.map((notice) => ({ title: notice.title, id: notice.id }))
  }
}
