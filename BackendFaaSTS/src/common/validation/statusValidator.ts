import { Status } from '@functions/project/entities/enums/ProjectEnums'
import { findMatchingEnumValue } from './EnumValueValidation'

export const setStatus = (status: string): string => {
  const statusValueFound = findMatchingEnumValue(status, Status)
  return statusValueFound ?? Status.DRAFT
}
