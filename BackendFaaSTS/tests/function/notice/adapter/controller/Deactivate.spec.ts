import 'reflect-metadata'

import { type MockProxy, mock } from 'jest-mock-extended'

import { type DeactivateUseCase } from '@common/domain/UseCase.interface'
import DeactivateNoticeController from '@functions/notice/controller/Deactivate'
import { type Notice } from '@functions/notice/entities'

describe('DeactivateNoticeController', () => {
  let systemUnderTest: DeactivateNoticeController
  let deactivateNoticeUseCase: MockProxy<DeactivateUseCase<Notice>>

  beforeAll(() => {
    deactivateNoticeUseCase = mock()
    deactivateNoticeUseCase.execute.mockResolvedValue({ deleted: true, message: 'Excluído com sucesso' })
    systemUnderTest = new DeactivateNoticeController(deactivateNoticeUseCase)
  })

  it('should return 200 on useCase success', async () => {
    const result = await systemUnderTest.handle('any_id')

    expect(result).toEqual({ statusCode: 200, data: 'Excluído com sucesso' })
  })

  it('should return 400 on useCase fail', async () => {
    deactivateNoticeUseCase.execute.mockResolvedValue({ deleted: false, message: 'Não foi possível excluir, tente novamente mais tarde!' })

    const result = await systemUnderTest.handle('any_id')

    expect(result).toEqual({ statusCode: 400, data: 'Não foi possível excluir, tente novamente mais tarde!' })
  })
})
