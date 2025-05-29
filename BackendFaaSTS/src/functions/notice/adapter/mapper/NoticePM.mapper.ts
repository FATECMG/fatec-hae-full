import { type Mapper } from '@common/mapper/BaseMapper'
import { createStandardFormatDate } from '@common/utils/date/createStandardFormatDate'

import { type Notice, NoticePM } from '@functions/notice/entities'

import { injectable } from 'inversify'

@injectable()
export default class NoticePresentationModelMapper implements Mapper<Notice, NoticePM> {
  async execute (entity: Notice): Promise<NoticePM> {
    return new NoticePM({
      id: entity.id,
      title: entity.title,
      topicsOfInterest: entity.topicsOfInterest,
      description: entity.description,
      semester: entity.semester,
      year: entity.year,
      openDate: createStandardFormatDate(entity.openDate),
      closeDate: createStandardFormatDate(entity.closeDate),
      evaluationEndDate: createStandardFormatDate(entity.evaluationEndDate),
      course: entity.course,
      active: entity.active
    })
  }
}
