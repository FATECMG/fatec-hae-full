import { ProjectDTO } from '@functions/project/entities/dto/ProjectDTO'

describe('ProjectDTO', () => {
  let projectDTOTemplate: ProjectDTO

  beforeAll(() => {
    projectDTOTemplate = {
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
      topicsOfInterest: ['any_topicOfInterest'],
      complianceModel: 'any_complianceModel',
      schedule: 'any_schedule',
      proposedHours: 'any_hours_proposed',
      active: true
    }
  })

  it('should return its attributes', () => {
    const sut = new ProjectDTO({ ...projectDTOTemplate })
    expect(sut).toEqual(new ProjectDTO({
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
      topicsOfInterest: ['any_topicOfInterest'],
      complianceModel: 'any_complianceModel',
      schedule: 'any_schedule',
      proposedHours: 'any_hours_proposed',
      active: true
    }))
  })

  it('should set active as \'true\' when active is not passed', () => {
    const sut = new ProjectDTO({ ...projectDTOTemplate, active: undefined })
    expect(sut.active).not.toBeUndefined()
    expect(sut.active).toBe(true)
  })
})
