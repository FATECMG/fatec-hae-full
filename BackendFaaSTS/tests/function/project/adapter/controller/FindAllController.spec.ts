import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { type Mapper } from '@common/mapper/BaseMapper'
import { type CognitoAuthenticationService } from '@common/auth/cognito/CognitoAuthenticationService'
import { type FindOneUseCase, type FindAllWithFilterUseCase } from '@common/domain/UseCase.interface'
// import { InfraError } from '@common/error/InfraError'

import { type Project } from '@functions/project/entities/Project'
import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'
import { FindAllProjectController } from '@functions/project/controller/FindAll'
import { type ProjectFilter } from '@functions/project/adapter/external/web/filter/ProjectFilter'
import { type User } from '@functions/user/entities/User'
import { type Notice } from '@functions/notice/entities'
import { type UserDataResponse } from '@functions/auth/entities/AuthUserDataResponse'
import { IDNotFoundError } from '@common/error/NotFoundError'

describe('Find All Projects Controller', () => {
  let templateProject: Project
  let templateNotice: Notice
  let templateCognitoUser: UserDataResponse
  let templateUser: User
  let templatePresentation: ProjectPM
  let systemUnderTest: FindAllProjectController
  let projectUseCases: MockProxy<FindAllWithFilterUseCase<Project, ProjectFilter>>
  let entityToPresentationModelMapper: MockProxy<Mapper<Project, ProjectPM>>
  let findOneUser: MockProxy<FindOneUseCase<User>>
  let findOneNotice: MockProxy<FindOneUseCase<Notice>>
  let cognitoService: MockProxy<CognitoAuthenticationService>

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
    templateCognitoUser = {
      id: 'any_user_id',
      email: 'any_email',
      name: 'any_name',
      role: 'DIRETOR'
    }
    templateUser = {
      id: 'any_user_id',
      email: 'any_email',
      academicTitle: 'GRADUADO',
      name: 'any_name',
      roles: 'DIRETOR',
      courses: [],
      password: 'any_password',
      phone: 'any_phone',
      registerNumber: 'any_register_number',
      active: true
    }
    templateNotice = {
      id: 'any_notice_id',
      description: 'any_description',
      title: 'any_title',
      evaluationEndDate: 'any_evaluation_end_date',
      openDate: 'any_open_date',
      semester: 'any_semester',
      topicsOfInterest: ['any_topic'],
      year: 'any_year',
      course: {
        id: 'any_course_id',
        name: 'any_course_name'
      },
      closeDate: 'any_close_date',
      active: true
    }
    entityToPresentationModelMapper = mock()
    entityToPresentationModelMapper.execute.mockResolvedValue(templatePresentation)
    projectUseCases = mock()
    projectUseCases.execute.mockResolvedValue([templateProject])
    findOneUser = mock()
    findOneUser.execute.mockResolvedValue(templateUser)
    findOneNotice = mock()
    findOneNotice.execute.mockResolvedValue(templateNotice)
    cognitoService = mock()
    cognitoService.getUserByToken.mockResolvedValue(templateCognitoUser)
    systemUnderTest = new FindAllProjectController(entityToPresentationModelMapper, projectUseCases, findOneUser, findOneNotice, cognitoService)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 on useCases success', async () => {
    const result = await systemUnderTest.handle({ active: true, status: ['any_status'] }, 'any_token')

    expect(result).toEqual({ statusCode: 200, data: [templatePresentation] })
    expect(projectUseCases.execute).toHaveBeenCalledTimes(1)
    expect(findOneUser.execute).toHaveBeenCalledTimes(1)
    expect(cognitoService.getUserByToken).toHaveBeenCalledTimes(1)
  })

  it('should return 200 on success and empty projects array if user has no projects to be seen', async () => {
    templateCognitoUser = { ...templateCognitoUser, role: 'PROFESSOR' }
    templateUser = { ...templateUser, roles: 'PROFESSOR', courses: [{ id: 'any_other_course_id', name: 'any_other_course_name' }] }

    const result = await systemUnderTest.handle({ active: true, status: ['any_status'] }, 'any_token')

    expect(result).toEqual({ statusCode: 200, data: [] })
  })

  it('should return 400 if cognito fails', async () => {
    cognitoService.getUserByToken.mockRejectedValueOnce(new IDNotFoundError('any_error', 'any_entity'))

    const result = await systemUnderTest.handle({ active: true, status: ['any_status'] }, 'any_token')

    expect(result).toEqual({ statusCode: 400, data: 'Houve um erro com a autenticação!' })
  })

  it('should return 500 on infra error', async () => {
    projectUseCases.execute.mockRejectedValueOnce(new Error('any_error'))

    const result = await systemUnderTest.handle({ active: true, status: ['any_status'] }, 'any_token')

    expect(result).toEqual({ statusCode: 500, data: 'any_error' })
  })
})
