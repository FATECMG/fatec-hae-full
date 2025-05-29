import 'reflect-metadata'

import { type DeactivateUseCase } from '@common/domain/UseCase.interface'
import { DeactivateCourseController } from '@functions/course/controller/DeactivateController'
import { type Course } from '@functions/course/entities/Course'

import { type MockProxy, mock } from 'jest-mock-extended'

describe('DeactivateController', () => {
  let systemUnderTest: DeactivateCourseController
  let deactivateCourseUseCase: MockProxy<DeactivateUseCase<Course>>

  beforeAll(() => {
    deactivateCourseUseCase = mock()
    deactivateCourseUseCase.execute.mockResolvedValue({ deleted: true, message: 'Excluído com sucesso' })
    systemUnderTest = new DeactivateCourseController(deactivateCourseUseCase)
  })

  it('should return 200 on useCase success', async () => {
    const result = await systemUnderTest.handle('any_id')

    expect(result).toEqual({ statusCode: 200, data: 'Excluído com sucesso' })
  })

  it('should return 400 on useCase fail', async () => {
    deactivateCourseUseCase.execute.mockResolvedValue({ deleted: false, message: 'Não foi possível excluir, tente novamente mais tarde!' })

    const result = await systemUnderTest.handle('any_id')

    expect(result).toEqual({ statusCode: 400, data: 'Não foi possível excluir, tente novamente mais tarde!' })
  })
})
