import 'reflect-metadata'

import { type MockProxy, mock } from 'jest-mock-extended'

import { FindOneUseCase, type FindAllUseCase } from '@common/domain/UseCase.interface'
import { type Mapper } from '@common/mapper/BaseMapper'
import FindAllNoticeController from '@functions/notice/controller/FindAll'
import { Notice, type NoticePM } from '@functions/notice/entities'
import { AuthenticationService } from '@common/auth/AuthenticationService.interface'
import { User } from '@functions/user/entities/User'

xdescribe('FindAllNoticeController', () => {
  let templateNotice: Notice
  let systemUnderTest: FindAllNoticeController
  let findAllNoticeUseCase: MockProxy<FindAllUseCase<Notice>>
  let userToPresentationModelMapper: MockProxy<Mapper<Notice, NoticePM>>
  let authService: MockProxy<AuthenticationService>
  let findOneUserUseCase: MockProxy<FindOneUseCase<User>>

  beforeAll(() => {
    templateNotice = new Notice({
      title: 'any_title',
      description: 'any_description',
      openDate: 'any_openDate',
      closeDate: 'any_closeDate',
      evaluationEndDate: 'any_evaluationEndDate',
      semester: 'any_semester',
      year: 'any_year',
      topicsOfInterest: ['any_topicOfInterest'],
      active: true
    })

    findAllNoticeUseCase = mock()
    findAllNoticeUseCase.execute.mockResolvedValue([templateNotice])
    userToPresentationModelMapper = mock()

    authService = mock()
    authService.getUserByToken.mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      role: 'any_role'
    })

    findOneUserUseCase = mock()
    findOneUserUseCase.execute.mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      roles: 'any_role',
      courses: [
        {
          id: 'any_id',
          name: 'any_name'
        }
      ],
      academicTitle: 'GRADUADO',
      phone: 'any_phone',
      registerNumber: 'any_registerNumber',
      active: true,
      password: 'any_password'
    })
    
    userToPresentationModelMapper.execute.mockResolvedValue({ ...templateNotice })
    systemUnderTest = new FindAllNoticeController(userToPresentationModelMapper, findAllNoticeUseCase, findOneUserUseCase, authService)
  })

  it('should return 200 on useCase success', async () => {
    const result = await systemUnderTest.handle('any_token', true)

    expect(result).toEqual({ statusCode: 200, data: [templateNotice] })
  })
})
