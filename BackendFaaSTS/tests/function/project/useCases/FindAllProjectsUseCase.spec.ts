import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { type FindAllEntityWithFilterRepository } from '@common/repository/RepositoryInterface'

import { type ProjectFilter } from '@functions/project/adapter/external/web/filter/ProjectFilter'
import { type Project } from '@functions/project/entities/Project'
import { FindAllProjectUseCase } from '@functions/project/useCases/FindAll'

describe('Find All Projects UseCase', () => {
  let templateProject: Project
  let projectRepository: MockProxy<FindAllEntityWithFilterRepository<Project, ProjectFilter>>
  let systemUnderTest: FindAllProjectUseCase

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
    projectRepository = mock()
    projectRepository.perform.mockResolvedValue([templateProject])
    systemUnderTest = new FindAllProjectUseCase(projectRepository)
  })

  it('should return a Project Array when ProjectRepository returns', async () => {
    const result = await systemUnderTest.execute({ active: true, status: ['any_status'] })

    expect(projectRepository.perform).toHaveBeenCalledTimes(1)
    expect(result).toEqual([templateProject])
  })

  it('should return a empty Project Array when ProjectRepository returns', async () => {
    projectRepository.perform.mockResolvedValueOnce([])

    const result = await systemUnderTest.execute({ active: true, status: ['any_status'] })

    expect(result).toEqual([])
  })
})
