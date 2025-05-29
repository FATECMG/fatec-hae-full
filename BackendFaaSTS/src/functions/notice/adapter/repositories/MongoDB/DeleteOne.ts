import { connectDatabase } from '@common/external/database/MongoDB'
import { type DeleteEntityRepository } from '@common/repository/RepositoryInterface'

import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'

import { injectable } from 'inversify'

@injectable()
export default class DeleteNoticeMongoRepository implements DeleteEntityRepository {
  async perform (id: string): Promise<boolean> {
    await connectDatabase()
    const noticeDeleted = await NoticeModel.findOneAndDelete({ id })
    return noticeDeleted !== null
  }
}
