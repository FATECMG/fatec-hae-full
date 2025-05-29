import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { type ActivateEntityRepository } from '@common/repository/RepositoryInterface'
import { type School } from '@functions/school/entities/School'
import { ActivateSchoolUseCase } from '@functions/school/useCases/Activate'

describe('ActivateSchoolUseCase', () => {
  let systemUnderTest: ActivateSchoolUseCase
  let courseRepository: MockProxy<ActivateEntityRepository<School>>

  beforeAll(() => {
    courseRepository = mock()
    courseRepository.perform.mockResolvedValue(true)
    systemUnderTest = new ActivateSchoolUseCase(courseRepository)
  })

  it('should calls ActivateEntityRepository with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(courseRepository.perform).toHaveBeenCalledTimes(1)
    expect(courseRepository.perform).toHaveBeenCalledWith('any_id')
  })

  it('should return success message when Repo return true', async () => {
    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: true, message: 'Restaurado com sucesso' })
  })

  it('should return error message when Repo return false', async () => {
    courseRepository.perform.mockResolvedValueOnce(false)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: false, message: 'Não foi possível restaurar, tente novamente mais tarde!' })
  })
})
