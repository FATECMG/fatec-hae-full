import CourseFunctions from '@functions/course/adapter/external/web/CourseFunctions'
import UserFunctions from '@functions/user/adapter/external/web/UserFunctions'
import RoleFunctions from '@functions/role/adapter/external/web/RoleFunctions'
import SchoolFunctions from '@functions/school/adapter/external/web/SchoolFunctions'
import ProjectFunctions from '@functions/project/adapter/external/web/ProjectFunctions'
import AddressFunctions from '@functions/address/adapter/external/web/AddressFunctions'
import NoticeFunctions from '@functions/notice/adapter/external/web/NoticeFunctions'
import AuthFunction from '@functions/auth/adapter/external/web/AuthFunction'
import EmailFunction from '@functions/email/handler/EmailFunction'
import ProjectCommentsFunctions from '@functions/comment/project/adapter/external/web/ProjectCommentsFunctions'
import PasswordValidatorFunctions from '@functions/passwordvalidation/adapter/external/PasswordValidatorFunctions'
import ReportFunctions from '@functions/report/adapter/external/ReportFunctions'
import GenerateURLsFunctions from '@functions/utils/s3urls/adapter/external/GenerateURLsFunctions'

export default {
  ...CourseFunctions,
  ...UserFunctions,
  ...RoleFunctions,
  ...SchoolFunctions,
  ...ProjectFunctions,
  ...AddressFunctions,
  ...NoticeFunctions,
  ...AuthFunction,
  ...EmailFunction,
  ...ProjectCommentsFunctions,
  ...PasswordValidatorFunctions,
  ...ReportFunctions,
  ...GenerateURLsFunctions
} as const
