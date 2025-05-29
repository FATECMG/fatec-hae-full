import 'reflect-metadata'

import { type MockProxy, mock } from 'jest-mock-extended'
import ActivateNoticeController from '@functions/notice/controller/Activate'
import { type ActivateUseCase } from '@common/domain/UseCase.interface'
import type Notice from '@functions/notice/entities/Notice'

describe('ActivateNoticeController', () => {
  let systemUnderTest: ActivateNoticeController
  let activateNoticeUseCase: MockProxy<ActivateUseCase<Notice>>

  beforeAll(() => {
    activateNoticeUseCase = mock()
    activateNoticeUseCase.execute.mockResolvedValue({ deleted: true, message: 'Restaurado com sucesso' })
    systemUnderTest = new ActivateNoticeController(activateNoticeUseCase)
  })

  it('should return 200 on useCase success', async () => {
    const result = await systemUnderTest.handle('any_id')

    expect(result).toEqual({ statusCode: 200, data: 'Restaurado com sucesso' })
  })

  it('should return 400 on useCase fail', async () => {
    activateNoticeUseCase.execute.mockResolvedValue({ deleted: false, message: 'Não foi possível restaurar, tente novamente mais tarde!' })

    const result = await systemUnderTest.handle('any_id')

    expect(result).toEqual({ statusCode: 400, data: 'Não foi possível restaurar, tente novamente mais tarde!' })
  })
})
