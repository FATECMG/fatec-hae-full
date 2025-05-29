import { ICollaborator } from '../../collaborators/entities/interfaces'
import { ILogin } from '../entities/interfaces'

export interface ILoginUseCase {
  login?(login: ILogin): Promise<ILogin>
  loginCollab?(login: ILogin): Promise<ICollaborator>
  loginPrep?(login: ILogin): Promise<void>
}
