import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { ICollaborator } from '../../../collaborators/entities/interfaces'
import axios from 'axios'
import { BASE_URL } from '../../../../shared/config/params'
import { DomainError } from '../../../../shared/errors/domain.error'
import Qs from 'qs'

@injectable()
export class FindOneCollaboratorExternal
  implements IExternal<ICollaborator, ICollaborator> {
  async call(collaborator: ICollaborator): Promise<ICollaborator> {
    try {
      const { data } = await axios({
        url: `${BASE_URL}/collaborators/name/${collaborator.name}`,
        paramsSerializer: function (params) {
          return Qs.stringify(params, { arrayFormat: 'brackets' })
        },
        params: { episode: collaborator.episode },
      })
      if (data) {
        if (!data.active) {
          throw new DomainError({
            errorCode: 'login-009',
            message: 'Usuário desativado.',
          })
        }
        return data as ICollaborator
      }
      throw new DomainError({
        errorCode: 'login-008',
        message: 'Usuário não encontrado.',
      })
    } catch (err) {
      throw new DomainError(err)
    }
  }
}
