import { ICollaborator } from '../../entities/interfaces'

export interface ICollaboratorRepository {
  findOne?(
    filter: any,
    projection: string,
    populate?: any,
  ): Promise<ICollaborator>
  find?(
    filter: any,
    projection?: string,
    populate?: any,
  ): Promise<ICollaborator[]>
  create?(collaborator: ICollaborator): Promise<ICollaborator>
  update?(collaboratorr: ICollaborator): Promise<ICollaborator>
}
