import { type NoticeEmailProps } from '@functions/notice/entities/NoticeEmail'

export interface AlertNotice {
  execute: (props: NoticeEmailProps) => Promise<void | Error>
}
