import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { type DeleteEntityRepository } from '@common/repository/RepositoryInterface'
import { DeleteNoticeUseCase } from '@functions/notice/useCases/UseCases'

describe('DeleteNoticeUseCase', () => {
  let systemUnderTest: DeleteNoticeUseCase
  let NoticeRepository: MockProxy<DeleteEntityRepository>

  beforeAll(() => {
    NoticeRepository = mock()
    NoticeRepository.perform.mockResolvedValue(true)
    systemUnderTest = new DeleteNoticeUseCase(NoticeRepository)
  })

  it('should calls DeleteUserMongoRepository with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(NoticeRepository.perform).toHaveBeenCalledTimes(1)
    expect(NoticeRepository.perform).toHaveBeenCalledWith('any_id')
  })

  it('should return success message when Repo return true', async () => {
    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: true, message: 'Excluído com sucesso' })
  })

  it('should return error message when Repo return false', async () => {
    NoticeRepository.perform.mockResolvedValueOnce(false)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: false, message: 'Não foi possível excluir, tente novamente mais tarde!' })
  })
})
