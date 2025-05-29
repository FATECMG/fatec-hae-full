import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { DeleteSchoolUseCase } from '@functions/school/useCases/Delete'
import { type DeleteEntityRepository } from '@common/repository/RepositoryInterface'

describe('DeleteSchoolUseCase', () => {
  let schoolRepository: MockProxy<DeleteEntityRepository>
  let systemUnderTest: DeleteSchoolUseCase

  beforeAll(() => {
    schoolRepository = mock()
    schoolRepository.perform.mockResolvedValueOnce(true)
    systemUnderTest = new DeleteSchoolUseCase(schoolRepository)
  })

  it('should return success message when repo return true', async () => {
    const result = await systemUnderTest.execute('any_id')

    expect(result.message).toBe('Excluído com sucesso')
  })

  it('should return failure message when repo return false', async () => {
    schoolRepository.perform.mockResolvedValueOnce(false)

    const result = await systemUnderTest.execute('any_id')

    expect(result.message).toBe('Não foi possível excluir, tente novamente mais tarde!')
  })
})
