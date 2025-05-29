import { type Mapper } from '@common/mapper/BaseMapper'
import { createStandardFormatDate } from '@common/utils/date/createStandardFormatDate'

import { Notice, type NoticeDTO } from '@functions/notice/entities'

import { injectable } from 'inversify'

@injectable()
export default class NoticeMapper implements Mapper<NoticeDTO, Notice> {
  async execute (dto: NoticeDTO): Promise<Notice> {
    return new Notice({
      title: dto.title.toLocaleUpperCase(),
      topicsOfInterest: [...dto.topicsOfInterest].map(topic => topic.toLocaleUpperCase()),
      description: dto.description.toLocaleUpperCase(),
      semester: dto.semester.toLocaleUpperCase(),
      year: dto.year.toLocaleUpperCase(),
      openDate: createStandardFormatDate(dto.openDate),
      closeDate: createStandardFormatDate(dto.closeDate),
      evaluationEndDate: createStandardFormatDate(dto.evaluationEndDate),
      course: dto.course,
      active: dto.active ?? undefined
    })
  }
}
