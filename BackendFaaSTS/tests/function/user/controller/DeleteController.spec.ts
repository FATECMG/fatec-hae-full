import 'reflect-metadata'

import { type DeleteUseCase } from '@common/domain/UseCase.interface'
import { DeleteUserController } from '@functions/user/controller/DeleteController'

import { type MockProxy, mock } from 'jest-mock-extended'

describe('DeleteUserController', () => {
  let systemUnderTest: DeleteUserController
  let deleteUserUseCase: MockProxy<DeleteUseCase>

  beforeAll(() => {
    deleteUserUseCase = mock()
    deleteUserUseCase.execute.mockResolvedValue({ deleted: true, message: 'Excluído com sucesso' })
    systemUnderTest = new DeleteUserController(deleteUserUseCase)
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
