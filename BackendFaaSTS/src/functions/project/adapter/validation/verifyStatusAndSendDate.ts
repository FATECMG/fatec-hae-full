import { ValidationError } from '@common/error/ValidationError'

import { Status } from '@functions/project/entities/enums/ProjectEnums'

import { isPast } from 'date-fns'

export function verifyStatusAndSendDate (status: string, sendDate: Date): void {
  if (status !== Status.DRAFT) {
    if (sendDate === undefined || sendDate === null) {
      throw new ValidationError([{
        field: 'sendDate',
        message: 'Data de envio é obrigatória para projetos que não são rascunhos!'
      }])
    }
    if (isPast(sendDate)) {
      throw new ValidationError([{
        field: 'sendDate',
        message: 'Data de envio deve ser antes da data atual!'
      }])
    }
  } else {
    if (sendDate !== undefined && sendDate !== null) {
      throw new ValidationError([{
        field: 'sendDate',
        message: 'Data de envio não é permitida para projetos que são rascunhos!'
      }])
    }
  }
}
