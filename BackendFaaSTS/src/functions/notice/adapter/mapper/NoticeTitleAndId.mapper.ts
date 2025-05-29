import { type Mapper } from '@common/mapper/BaseMapper'

import { type NoticeTitleAndId, type NoticeTitleAndIdPM } from '@functions/notice/entities'

import { injectable } from 'inversify'

@injectable()
export default class NoticeTitleAndMapper implements Mapper<NoticeTitleAndId, NoticeTitleAndIdPM> {
  async execute (entity: NoticeTitleAndId): Promise<NoticeTitleAndIdPM> {
    return {
      id: entity.id,
      title: entity.title
    }
  }
}
