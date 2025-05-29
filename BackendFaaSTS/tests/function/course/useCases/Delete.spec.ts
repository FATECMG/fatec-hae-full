import 'reflect-metadata'

import { type DeleteEntityRepository } from '@common/repository/RepositoryInterface'
import { DeleteCourseUseCase } from '@functions/course/useCases/Delete'

import { mock, type MockProxy } from 'jest-mock-extended'

describe('DeleteCourseUseCase', () => {
  let systemUnderTest: DeleteCourseUseCase
  let courseRepository: MockProxy<DeleteEntityRepository>

  beforeAll(() => {
    courseRepository = mock()
    courseRepository.perform.mockResolvedValue(true)
    systemUnderTest = new DeleteCourseUseCase(courseRepository)
  })

  it('should calls DeleteUserMongoRepository with correct params', async () => {
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
