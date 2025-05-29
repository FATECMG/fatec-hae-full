import { type Mapper } from '@common/mapper/BaseMapper'

import { type NoticeTopicsOfInterest, type NoticeTopicsOfInterestPM } from '@functions/notice/entities'

import { injectable } from 'inversify'

@injectable()
export default class NoticeTopicsOfInterestPMMapper implements Mapper<NoticeTopicsOfInterest, NoticeTopicsOfInterestPM> {
  async execute (entity: NoticeTopicsOfInterest): Promise<NoticeTopicsOfInterestPM> {
    return {
      topicsOfInterest: entity.topicsOfInterest
    }
  }
}
