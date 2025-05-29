import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { type DeactivateEntityRepository } from '@common/repository/RepositoryInterface'
import { type School } from '@functions/school/entities/School'
import { DeactivateSchoolUseCase } from '@functions/school/useCases/Deactivate'

describe('DeactivateSchoolUseCase', () => {
  let systemUnderTest: DeactivateSchoolUseCase
  let courseRepository: MockProxy<DeactivateEntityRepository<School>>

  beforeAll(() => {
    courseRepository = mock()
    courseRepository.perform.mockResolvedValue(true)
    systemUnderTest = new DeactivateSchoolUseCase(courseRepository)
  })

  it('should calls DeactivateEntityRepository with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(courseRepository.perform).toHaveBeenCalledTimes(1)
    expect(courseRepository.perform).toHaveBeenCalledWith('any_id')
  })

  it('should return success message when Repo return true', async () => {
    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: true, message: 'Excluído com sucesso' })
  })

  it('should return error message when Repo return false', async () => {
    courseRepository.perform.mockResolvedValueOnce(false)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: false, message: 'Não foi possível excluir, tente novamente mais tarde!' })
  })
})
