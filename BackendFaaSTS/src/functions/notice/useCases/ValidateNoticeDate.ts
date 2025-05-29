import { type ValidateNoticeDate } from '@common/domain/UseCase.interface'
import { InvalidFormatDate, InvalidRangeDate } from '@common/error/InvalidDate'
import { differenceInDays, isBefore, isValid, parse } from 'date-fns'
import { injectable } from 'inversify'

export interface Dates {
  openDate: string
  closeDate: string
  evaluationEndDate: string
}

@injectable()
export default class ValidateNoticeDateUseCase implements ValidateNoticeDate {
  async execute (dates: Dates): Promise<Error | undefined> {
    if (!isValid(this.formatDate(dates.openDate))) {
      throw new InvalidFormatDate('openDate')
    }

    if (!isValid(this.formatDate(dates.closeDate))) {
      throw new InvalidFormatDate('closeDate')
    }

    if (!isValid(this.formatDate(dates.evaluationEndDate))) {
      throw new InvalidFormatDate('evaluationEndDate')
    }

    const openDate = this.formatDate(dates.openDate)
    const closeDate = this.formatDate(dates.closeDate)
    const evaluationEndDate = this.formatDate(dates.evaluationEndDate)

    // FIXME: remover esses comentários após o primeiro uso do sistema, uma vez que iremos aceitar
    // editais com data de abertura no passado
    // if (isPast(openDate)) {
    //   throw new InvalidRangeDate('openDate')
    // }

    if (isBefore(closeDate, openDate)) {
      throw new InvalidRangeDate('closeDate', 'Data de fim deve ser posterior a data de início')
    }

    if (differenceInDays(evaluationEndDate, closeDate) <= 0) {
      throw new InvalidRangeDate('evaluationEndDate', 'Data limite de avaliação deve ser posterior a data de fim de recebimento')
    }
    return undefined
  }

  private formatDate (date: string): Date {
    return parse(date, 'dd/MM/yyyy', new Date())
  }
}
