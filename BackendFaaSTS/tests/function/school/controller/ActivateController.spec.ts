import 'reflect-metadata'

import { type ActivateUseCase } from '@common/domain/UseCase.interface'

import { type School } from '@functions/school/entities/School'
import { ActivateSchoolController } from '@functions/school/controller/ActivateController'

import { type MockProxy, mock } from 'jest-mock-extended'

describe('ActivateController', () => {
  let systemUnderTest: ActivateSchoolController
  let activateCourseUseCase: MockProxy<ActivateUseCase<School>>

  beforeAll(() => {
    activateCourseUseCase = mock()
    activateCourseUseCase.execute.mockResolvedValue({ deleted: true, message: 'Restaurado com sucesso' })
    systemUnderTest = new ActivateSchoolController(activateCourseUseCase)
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
