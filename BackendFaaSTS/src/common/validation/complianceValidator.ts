import { ComplianceModel } from '@functions/project/entities/enums/ProjectEnums'
import { findMatchingEnumValue } from './EnumValueValidation'

export const setComplianceModel = (compliance: string): string => {
  const complianceModelValueFound = findMatchingEnumValue(compliance, ComplianceModel)
  return complianceModelValueFound ?? ComplianceModel.TO_BE_DEFINED
}
