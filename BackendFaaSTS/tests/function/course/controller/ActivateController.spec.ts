import 'reflect-metadata'

import { type ActivateUseCase } from '@common/domain/UseCase.interface'
import { ActivateCourseController } from '@functions/course/controller/ActivateController'
import { type Course } from '@functions/course/entities/Course'

import { type MockProxy, mock } from 'jest-mock-extended'

describe('ActivateController', () => {
  let systemUnderTest: ActivateCourseController
  let activateCourseUseCase: MockProxy<ActivateUseCase<Course>>

  beforeAll(() => {
    activateCourseUseCase = mock()
    activateCourseUseCase.execute.mockResolvedValue({ deleted: true, message: 'Restaurado com sucesso' })
    systemUnderTest = new ActivateCourseController(activateCourseUseCase)
  })

  it('should return 200 on useCase success', async () => {
    const result = await systemUnderTest.handle('any_id')

    expect(result).toEqual({ statusCode: 200, data: 'Restaurado com sucesso' })
  })

  it('should return 400 on useCase fail', async () => {
    activateCourseUseCase.execute.mockResolvedValue({ deleted: false, message: 'Não foi possível restaurar, tente novamente mais tarde!' })

    const result = await systemUnderTest.handle('any_id')

    expect(result).toEqual({ statusCode: 400, data: 'Não foi possível restaurar, tente novamente mais tarde!' })
  })
})
