import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { IDNotFoundError } from '@common/error/NotFoundError'
import { type Mapper } from '@common/mapper/BaseMapper'

import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'
import { type Project } from '@functions/project/entities/Project'
import { HandleUpdateProjectStatusController } from '@functions/project/controller/UpdateProjectStatus'
import { type UpdateProjectStatusUseCase } from '@functions/project/useCases/UpdateStatus'
import { StatusNotUpdated, StatusNotValid, StatusNotValidChange } from '@common/error/StatusError'
import { type CognitoAuthenticationService } from '@common/auth/cognito/CognitoAuthenticationService'

describe('ProjectController', () => {
  let templateProject: Project
  let templatePresentation: ProjectPM
  let systemUnderTest: HandleUpdateProjectStatusController
  let ProjectUseCases: MockProxy<UpdateProjectStatusUseCase>
  let entityToPresentationModelMapper: MockProxy<Mapper<Project, ProjectPM>>
  let authService: MockProxy<CognitoAuthenticationService>

  beforeAll(() => {
    templateProject = {
      id: 'any_id',
      title: 'any_title',
      description: 'any_description',
      justification: 'any_justification',
      references: 'any_references',
      objectives: 'any_objectives',
      methodology: 'any_methodology',
      complianceModel: 'any_complianceModel',
      topicsOfInterest: ['any_topic'],
      schedule: 'any_schedule',
      hours: {
        proposed: 'any_proposed_hours',
        approved: 'any_approved_hours'
      },
      notice: {
        id: 'any_notice_id',
        title: 'any_notice_title'
      },
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      comments: [],
      active: false,
      status: 'any_status'
    }

    templatePresentation = {
      id: 'any_id',
      title: 'any_title',
      description: 'any_description',
      justification: 'any_justification',
      references: 'any_references',
      objectives: 'any_objectives',
      methodology: 'any_methodology',
      complianceModel: 'any_complianceModel',
      topicsOfInterest: ['any_topic'],
      schedule: 'any_schedule',
      hours: {
        proposed: 'any_proposed_hours',
        approved: 'any_approved_hours'
      },
      notice: {
        id: 'any_notice_id',
        title: 'any_notice_title'
      },
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      comments: [],
      active: false,
      status: 'any_status'
    }

    entityToPresentationModelMapper = mock()
    entityToPresentationModelMapper.execute.mockResolvedValue(templatePresentation)
    ProjectUseCases = mock()
    ProjectUseCases.execute.mockResolvedValue(templateProject)
    authService = mock()

    authService.getUserByToken.mockResolvedValue({
      role: 'any_role',
      email: 'any_email',
      name: 'any_name',
      id: 'any_id'
    })

    systemUnderTest = new HandleUpdateProjectStatusController(ProjectUseCases, entityToPresentationModelMapper, authService)
  })

  it('should return 200 on useCase success', async () => {
    const result = await systemUnderTest.handle('any_id', 'any_status', 'any_token')

    expect(result).toEqual({ statusCode: 200, data: templatePresentation })
  })

  it('should return 404 on useCases NotFoundError', async () => {
    ProjectUseCases.execute.mockResolvedValueOnce(new IDNotFoundError('any_id', 'any_entity'))

    const result = await systemUnderTest.handle('any_id', 'any_status', 'any_token')

    expect(result).toEqual({
      statusCode: 404,
      data: {
        field: 'ID',
        message: 'Não foi possível encontrar any_entity com id: any_id'
      }
    })
  })

  it('should return 400 on useCases StatusNotUpdated', async () => {
    ProjectUseCases.execute.mockResolvedValueOnce(new StatusNotUpdated())

    const result = await systemUnderTest.handle('any_id', 'any_status', 'any_token')

    expect(result).toEqual({
      statusCode: 400,
      data: {
        field: 'status',
        message: 'Não foi possível atualizar o status do projeto'
      }
    })
  })

  it('should return 400 on useCases StatusNotValid', async () => {
    ProjectUseCases.execute.mockResolvedValueOnce(new StatusNotValid())

    const result = await systemUnderTest.handle('any_id', 'any_status', 'any_token')

    expect(result).toEqual({
      statusCode: 400,
      data: {
        field: 'status',
        message: 'O status informado não é válido'
      }
    })
  })

  it('should return 400 on useCases StatusNotValidChange', async () => {
    ProjectUseCases.execute.mockResolvedValueOnce(new StatusNotValidChange())

    const result = await systemUnderTest.handle('any_id', 'any_status', 'any_token')

    expect(result).toEqual({
      statusCode: 400,
      data: {
        field: 'status',
        message: 'Não é possível realizar a transição de status solicitada'
      }
    })
  })

  it('should return 500 on useCases infra failure', async () => {
    ProjectUseCases.execute.mockRejectedValueOnce(new Error('any_unexpected_error'))

    const result = await systemUnderTest.handle('any_id', 'any_status', 'any_token')

    expect(result).toEqual({ statusCode: 500, data: 'Erro inesperado!' })
  })

  it('should return 500 when authService throws', async () => {
    authService.getUserByToken.mockRejectedValueOnce(new Error('any_unexpected_error'))

    const result = await systemUnderTest.handle('any_id', 'any_status', 'any_token')

    expect(result).toEqual({ statusCode: 400, data: 'Houve um erro com a autenticação!' })
  })
})
