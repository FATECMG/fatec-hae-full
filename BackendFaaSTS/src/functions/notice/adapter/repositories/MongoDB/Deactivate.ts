import { connectDatabase } from '@common/external/database/MongoDB'
import { type DeactivateEntityRepository } from '@common/repository/RepositoryInterface'

import { type Notice } from '@functions/notice/entities'
import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'

import { injectable } from 'inversify'

@injectable()
export default class DeactivateNoticeMongoRepository implements DeactivateEntityRepository<Notice> {
  async perform (id: string): Promise<boolean> {
    await connectDatabase()
    const noticeDeactivated = await NoticeModel.findOneAndUpdate({ id }, { active: false }, { new: true })
    return !(noticeDeactivated == null) && !noticeDeactivated.active
  }
}
