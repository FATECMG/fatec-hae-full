import { IEmail } from '../entities/interfaces'

export interface IEmailsUseCase {
  send?(info: IEmail): Promise<void>
}
