import 'reflect-metadata'

import { ProjectMapper, ProjectPresentationModelMapper } from '@functions/project/adapter/mapper/Project.mapper'
import { Project, type ProjectProps } from '@functions/project/entities/Project'
import { ProjectDTO } from '@functions/project/entities/dto/ProjectDTO'

jest.mock('uuid', () => ({ v4: () => 'any_id' }))

describe('ProjectDTOMapper', () => {
  let project: ProjectDTO

  beforeEach(() => {
    project = {
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      notice: {
        id: 'any_notice_id',
        title: 'any_notice_title'
      },
      title: 'any_title',
      description: 'any_description',
      objectives: 'any_objectives',
      methodology: 'any_methodologies',
      justification: 'any_justification',
      references: 'any_references',
      topicsOfInterest: ['any_topic_of_Interest'],
      complianceModel: 'any_compliance_model',
      schedule: 'any_schedule',
      proposedHours: 'any_hours_proposed',
      active: true
    }
  })

  it('should map with the same data uppercased', async () => {
    const sut = new ProjectMapper()
    const result = await sut.execute(new ProjectDTO(project))
    expect(result).toEqual(new Project({
      author: result.author,
      notice: result.notice,
      title: result.title,
      description: result.description,
      objectives: result.objectives,
      methodology: result.methodology,
      justification: result.justification,
      references: result.references.toUpperCase(),
      topicsOfInterest: result.topicsOfInterest,
      complianceModel: result.complianceModel,
      schedule: result.schedule.toUpperCase(),
      comments: [],
      hours: result.hours,

      status: result.status,
      active: result.active
    }, result.id))
  })
})

describe('ProjectPresentationModelMapper', () => {
  let projectEntityTemplate: ProjectProps

  beforeEach(() => {
    projectEntityTemplate = {
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      notice: {
        id: 'any_notice_id',
        title: 'any_notice_title'
      },
      comments: [
        {
          id: 'any_id',
          author: {
            id: 'any_author_id',
            name: 'any_author_name'
          },
          content: 'any_content',
          timestamp: 'any_timestamp'
        }
      ],
      title: 'any_title',
      description: 'any_description',
      objectives: 'any_objectives',
      methodology: 'any_methodologies',
      justification: 'any_justification',
      references: 'any_references',
      topicsOfInterest: ['any_topic_of_Interest'],
      complianceModel: 'any_compliance_model',
      schedule: 'any_schedule',
      hours: {
        proposed: 'any_hours_proposed',
        approved: 'any_hours_invested'
      },
      active: true,
      status: 'any_status'
    }
  })

  it('should map with the same data', async () => {
    const sut = new ProjectPresentationModelMapper()
    const projectEntity = new Project({ ...projectEntityTemplate }, 'any_id')

    const result = await sut.execute(projectEntity)

    expect(result).toEqual({
      author: result.author,
      notice: result.notice,
      comments: result.comments,
      id: result.id,
      title: result.title,
      description: result.description,
      objectives: result.objectives,
      methodology: result.methodology,
      justification: result.justification,
      references: result.references,
      topicsOfInterest: result.topicsOfInterest,
      complianceModel: result.complianceModel,
      schedule: result.schedule,
      hours: result.hours,
      status: result.status,
      active: result.active
    })
  })
})
