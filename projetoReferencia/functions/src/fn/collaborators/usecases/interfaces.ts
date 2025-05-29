import { ICollaborator } from '../entities/interfaces'

export interface ICollaboratorUseCase {
  findOne?(
    collaborator: ICollaborator,
    projection: string,
    populate?: any,
  ): Promise<ICollaborator>
  create?(collaborator: ICollaborator): Promise<ICollaborator>
  update?(collaborator: ICollaborator): Promise<ICollaborator>
  list?(
    episodeId: string,
    filters?: any,
    populate?: any,
  ): Promise<ICollaborator[]>
  delete?(collaborator: ICollaborator): Promise<ICollaborator>
}
