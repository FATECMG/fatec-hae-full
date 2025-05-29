import 'reflect-metadata'

import { commentContainer } from '@functions/comment/project/shared/Di.container'
import { emailServiceContainer } from '@functions/email/shared/Di.container'
import { noticeContainer } from '@functions/notice/shared/Di.container'
import { projectContainer } from '@functions/project/shared/Di.container'
import { courseContainer } from '@functions/course/shared/Di.container'
import { userContainer } from '@functions/user/shared/Di.container'
import { AuthContainer } from '@functions/auth/shared/Di.container'
import { reportContainer } from '@functions/report/shared/Di.container'

import { Container } from 'inversify'


export const NoticeDependencies = Container.merge(
  noticeContainer,
  emailServiceContainer,
  AuthContainer,
  userContainer
)

export const ProjectDependencies = Container.merge(
  projectContainer,
  commentContainer,
  AuthContainer,
  userContainer,
  noticeContainer
)

export const UserDependencies = Container.merge(
  userContainer,
  courseContainer,
  AuthContainer
)

export const ReportDependencies = Container.merge(
  reportContainer,
  noticeContainer,
  projectContainer,
  userContainer,
  AuthContainer
)