import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { type ActivateEntityRepository } from '@common/repository/RepositoryInterface'
import { ActivateNoticeUseCase } from '@functions/notice/useCases/UseCases'
import { type Notice } from '@functions/notice/entities'

describe('ActivateNoticeUseCase', () => {
  let systemUnderTest: ActivateNoticeUseCase
  let NoticeRepository: MockProxy<ActivateEntityRepository<Notice>>

  beforeAll(() => {
    NoticeRepository = mock()
    NoticeRepository.perform.mockResolvedValue(true)
    systemUnderTest = new ActivateNoticeUseCase(NoticeRepository)
  })

  it('should calls ActivateEntityRepository with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(NoticeRepository.perform).toHaveBeenCalledTimes(1)
    expect(NoticeRepository.perform).toHaveBeenCalledWith('any_id')
  })

  it('should return success message when Repo return true', async () => {
    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: true, message: 'Restaurado com sucesso' })
  })

  it('should return error message when Repo return false', async () => {
    NoticeRepository.perform.mockResolvedValueOnce(false)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: false, message: 'Não foi possível restaurar, tente novamente mais tarde!' })
  })
})
