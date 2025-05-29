import { Project, type ProjectProps } from '@functions/project/entities/Project'

jest.mock('uuid', () => ({ v4: () => 'any_id' }))

describe('Project Entity', () => {
  let projectTemplate: ProjectProps

  beforeAll(() => {
    projectTemplate = {
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
      topicsOfInterest: ['any_topicOfInterest'],
      complianceModel: 'any_complianceModel',
      schedule: 'any_schedule',
      hours: {
        approved: 'any_hours_proposed',
        proposed: 'any_hours_proposed'
      },
      status: 'any_status',
      active: true
    }
  })

  it('should return its attributes', () => {
    const systemUnderTest = new Project({ ...projectTemplate }, 'any_id')
    expect(systemUnderTest).toEqual(new Project({
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
      topicsOfInterest: ['any_topicOfInterest'],
      complianceModel: 'any_complianceModel',
      schedule: 'any_schedule',
      hours: {
        approved: 'any_hours_proposed',
        proposed: 'any_hours_proposed'
      },
      status: 'any_status',
      active: true
    }, 'any_id'))
  })

  it('should generate an uuid if an uuid is not passed', () => {
    const sut = new Project({ ...projectTemplate })
    expect(sut.id).not.toBeUndefined()
    expect(sut.id).toBe('any_id')
  })

  it('not should generate an uuid if an uuid is passed', () => {
    const sut = new Project({ ...projectTemplate }, 'any_id_not_generated')
    expect(sut.id).toBe('any_id_not_generated')
  })

  it('should set status as \'RASCUNHO\' when status is not passed', () => {
    const expectedStatus = 'RASCUNHO'
    const sut = new Project({ ...projectTemplate, status: undefined })
    expect(sut.status).not.toBeUndefined()
    expect(sut.status).toBe(expectedStatus)
  })

  it('should set status as \'RASCUNHO\' when an inexistent status is passed', () => {
    const expectedStatus = 'RASCUNHO'
    const sut = new Project({ ...projectTemplate, status: 'any_inexistent_status' })
    expect(sut.status).not.toBeUndefined()
    expect(sut.status).toBe(expectedStatus)
  })

  it('should set complianceModel as \'A DEFINIR\' when complianceModel is not passed', () => {
    const expectedComplianceModel = 'A DEFINIR'
    const sut = new Project({ ...projectTemplate, complianceModel: '' })
    expect(sut.complianceModel).not.toBeUndefined()
    expect(sut.complianceModel).toBe(expectedComplianceModel)
  })

  it('should set complianceModel as \'A DEFINIR\' when an inexistent complianceModel is passed', () => {
    const expectedComplianceModel = 'A DEFINIR'
    const sut = new Project({ ...projectTemplate, complianceModel: 'any_inexistent_complianceModel' })
    expect(sut.complianceModel).not.toBeUndefined()
    expect(sut.complianceModel).toBe(expectedComplianceModel)
  })

  it('should set complianceModel as \'PRESENCIAL\' when complianceModel value is \'presencial\'', () => {
    const expectedComplianceModel = 'PRESENCIAL'
    const sut = new Project({ ...projectTemplate, complianceModel: 'presencial' })
    expect(sut.complianceModel).not.toBeUndefined()
    expect(sut.complianceModel).toBe(expectedComplianceModel)
  })

  it('should set complianceModel as \'REMOTO\' when complianceModel value is \'remoto\'', () => {
    const expectedComplianceModel = 'REMOTO'
    const sut = new Project({ ...projectTemplate, complianceModel: 'remoto' })
    expect(sut.complianceModel).not.toBeUndefined()
    expect(sut.complianceModel).toBe(expectedComplianceModel)
  })

  it('should set complianceModel as \'HÌBRIDO\' when complianceModel value is \'hibrido\'', () => {
    const expectedComplianceModel = 'HÍBRIDO'
    const sut = new Project({ ...projectTemplate, complianceModel: 'hibrido' })
    expect(sut.complianceModel).not.toBeUndefined()
    expect(sut.complianceModel).toBe(expectedComplianceModel)
  })
})
