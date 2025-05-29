import { InvalidRangeDate } from '@common/error/InvalidDate'
import { createStandardFormatDate } from '@common/utils/date/createStandardFormatDate'
import { DateNormalizer } from '@common/utils/date/dateNormalizer'

import { isAfter, isBefore } from 'date-fns'

export enum DateValidationOption {
  IS_BEFORE,
  IS_AFTER
}

interface Params {
  date: string
  targetDate: string
  option: DateValidationOption
}

export type ValidateDate = (params: Params) => void

export const validateDate: ValidateDate = (params: Params) => {
  const { date, targetDate, option } = params
  const currentDate = DateNormalizer.fromBrazillianPattern(date)
  const dateToCompare = DateNormalizer.fromBrazillianPattern(targetDate)
  const compareDate = getMethodToCompare(option)
  const errorMessage = getTemplateErrorMessage(option, targetDate)

  if (compareDate(currentDate, dateToCompare)) {
    throw new InvalidRangeDate('sendDate', errorMessage)
  }
}

type GetMethodToCompare = (date: Date, dateToCompare: Date) => boolean
const getMethodToCompare = (option: DateValidationOption): GetMethodToCompare => {
  switch (option) {
    case DateValidationOption.IS_BEFORE:
      return isBefore
    case DateValidationOption.IS_AFTER:
      return isAfter
  }
}

const getTemplateErrorMessage = (option: DateValidationOption, date: string): string => {
  switch (option) {
    case DateValidationOption.IS_BEFORE:
      return `Data não pode ser antes que ${createStandardFormatDate(date)}`
    case DateValidationOption.IS_AFTER:
      return `Data não pode ser depois que ${createStandardFormatDate(date)}`
  }
}
