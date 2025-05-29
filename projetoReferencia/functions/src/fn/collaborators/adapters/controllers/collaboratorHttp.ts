import { Handler } from '../../../../shared/adapters/controllers/interfaces'
import main from '../../../../shared/adapters/controllers/main'
import { getExpress } from '../../../../shared/utils/express'
import { container } from '../../shared/di.container'
import { Locator } from '../../shared/di.enums'

const collaboratorFindOneHttp = container.get<Handler>(
  Locator.CollaboratorFindOneHttp,
)

const createCollaboratorHttp = container.get<Handler>(
  Locator.CreateCollaboratorHttp,
)

const updateCollaboratorHttp = container.get<Handler>(
  Locator.UpdateCollaboratorHttp,
)

const listCollaboratorsByEpisodeHttp = container.get<Handler>(
  Locator.ListCollaboratorsByEpisodeHttp,
)

const deleteCollaboratorHttp = container.get<Handler>(
  Locator.DeleteCollaboratorHttp,
)

export const collaborators = getExpress()

collaborators.put('/:collaborator', main(updateCollaboratorHttp))
collaborators.get('/name/:name', main(collaboratorFindOneHttp))
collaborators.post('', main(createCollaboratorHttp))
collaborators.get('', main(listCollaboratorsByEpisodeHttp))
collaborators.delete('/:collaborator', main(deleteCollaboratorHttp))
