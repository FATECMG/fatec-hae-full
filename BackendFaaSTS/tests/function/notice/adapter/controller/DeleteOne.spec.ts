import 'reflect-metadata'

import { type MockProxy, mock } from 'jest-mock-extended'

import DeleteNoticeController from '@functions/notice/controller/DeleteOne'
import { type DeleteUseCase } from '@common/domain/UseCase.interface'

describe('DeleteNoticeController', () => {
  let systemUnderTest: DeleteNoticeController
  let deleteUserUseCase: MockProxy<DeleteUseCase>

  beforeAll(() => {
    deleteUserUseCase = mock()
    deleteUserUseCase.execute.mockResolvedValue({ deleted: true, message: 'Excluído com sucesso' })
    systemUnderTest = new DeleteNoticeController(deleteUserUseCase)
  })

  it('should return 200 on useCase success', async () => {
    const result = await systemUnderTest.handle('any_id')

    expect(result).toEqual({ statusCode: 200, data: 'Excluído com sucesso' })
  })

  it('should return 400 on useCase fail', async () => {
    deleteUserUseCase.execute.mockResolvedValue({ deleted: false, message: 'Não foi possível excluir, tente novamente mais tarde!' })

    const result = await systemUnderTest.handle('any_id')

    expect(result).toEqual({ statusCode: 400, data: 'Não foi possível excluir, tente novamente mais tarde!' })
  })
})
