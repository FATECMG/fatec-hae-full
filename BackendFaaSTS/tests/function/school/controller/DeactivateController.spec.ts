import 'reflect-metadata'

import { type DeactivateUseCase } from '@common/domain/UseCase.interface'
import { DeactivateSchoolController } from '@functions/school/controller/DeactivateController'
import { type School } from '@functions/school/entities/School'

import { type MockProxy, mock } from 'jest-mock-extended'

describe('DeactivateController', () => {
  let systemUnderTest: DeactivateSchoolController
  let deactivateCourseUseCase: MockProxy<DeactivateUseCase<School>>

  beforeAll(() => {
    deactivateCourseUseCase = mock()
    deactivateCourseUseCase.execute.mockResolvedValue({ deleted: true, message: 'Excluído com sucesso' })
    systemUnderTest = new DeactivateSchoolController(deactivateCourseUseCase)
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
