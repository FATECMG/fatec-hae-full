import { connectDatabase } from '@common/external/database/MongoDB'
import { type ActivateEntityRepository } from '@common/repository/RepositoryInterface'

import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'
import { type Notice } from '@functions/notice/entities'

import { injectable } from 'inversify'

@injectable()
export default class ActivateNoticeMongoRepository implements ActivateEntityRepository<Notice> {
  async perform (id: string): Promise<boolean> {
    await connectDatabase()
    const noticeActivated = await NoticeModel.findOneAndUpdate({ id }, { active: true }, { new: true })
    return !(noticeActivated == null) && noticeActivated.active
  }
}
