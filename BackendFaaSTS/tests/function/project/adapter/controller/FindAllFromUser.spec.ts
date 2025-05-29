import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { type Mapper } from '@common/mapper/BaseMapper'
import { type FindAllFromEntityUseCase } from '@common/domain/UseCase.interface'
import { type Project } from '@functions/project/entities/Project'
import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'
import { HandleFindAllProjectsFromUserController } from '@functions/project/controller/FindAllFromUser'

describe('Find All Projects Controller', () => {
  let templateProject: Project
  let systemUnderTest: HandleFindAllProjectsFromUserController
  let projectUseCases: MockProxy<FindAllFromEntityUseCase<Project>>
  let mapper: MockProxy<Mapper<Project, ProjectPM>>

  beforeAll(() => {
    templateProject = {
      id: 'any_id',
      title: 'any_title',
      description: 'any_description',
      justification: 'any_justification',
      objectives: 'any_objectives',
      methodology: 'any_methodology',
      references: 'any_references',
      schedule: 'any_schedule',
      complianceModel: 'any_complianceModel',
      topicsOfInterest: ['any_topic'],
      hours: {
        proposed: 'any_proposed',
        approved: 'any_approved'
      },
      author: {
        id: 'any_id',
        name: 'any_name'
      },
      notice: {
        id: 'any_id',
        title: 'any_title'
      },
      comments: [],
      status: 'any_status',
      active: true
    }

    mapper = mock()
    mapper.execute.mockResolvedValue(templateProject)
    projectUseCases = mock()
    projectUseCases.execute.mockResolvedValue([templateProject])
    systemUnderTest = new HandleFindAllProjectsFromUserController(projectUseCases, mapper)
  })

  it('should return 200 on useCases success', async () => {
    const result = await systemUnderTest.handle('any_user_id')

    expect(result).toEqual({ statusCode: 200, data: [templateProject] })
    expect(projectUseCases.execute).toHaveBeenCalledTimes(1)
  })
})
