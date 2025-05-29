import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { ProjectDependencies } from '@libs/Inversify'
import { middyfy } from '@libs/Lambda'

import { type SaveController } from '@common/domain/Controllers'

import type Schema from '@functions/project/adapter/external/web/Schema'
import { ProjectDTO } from '@functions/project/entities/dto/ProjectDTO'
import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'
import { type Project } from '@functions/project/entities/Project'
import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'

const saveProjectController = ProjectDependencies.get<SaveController<ProjectDTO, Project, ProjectPM>>(ProjectControllerLocator.SaveProjectController)

const postProjectHandler: ValidatedEventAPIGatewayProxyEvent<typeof Schema> = async (event, context) => {
  const request = event.body
  context.callbackWaitsForEmptyEventLoop = false
  const param = new ProjectDTO({
    author: request.author,
    title: request.title,
    notice: request.notice,
    description: request.description,
    complianceModel: request.complianceModel,
    proposedHours: request.proposedHours,
    justification: request.justification,
    references: request.references,
    methodology: request.methodology,
    objectives: request.objectives,
    schedule: request.schedule,
    topicsOfInterest: request.topicsOfInterest,
    active: request.active
  })

  const response = await saveProjectController.handle(param)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const postProject = middyfy(postProjectHandler)
