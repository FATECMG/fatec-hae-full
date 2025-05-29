import { Container } from 'inversify'
import { ISuperBusinessRepository } from '../repositories/interfaces.repositories'
import { SuperBusinessRepository } from '../repositories/superbusiness.repositories'
import { Locator } from '../../shared/di.enums'
import { mocked } from 'ts-jest/utils'
import { warmConnections } from '../../../../index'
import { model } from 'mongoose'

jest.mock('../../../../index')
const mockedWarmConnections = mocked(warmConnections, true)
jest.mock('mongoose')
const mockedModel = mocked(model, true)
const container = new Container()
container
  .bind<ISuperBusinessRepository>(Locator.SuperBusinessRepository)
  .to(SuperBusinessRepository)
describe('superbusiness repository', () => {
  mockedWarmConnections.mockResolvedValue()
  mockedModel.mockImplementation(() => {
    return {
      findOne: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({
        email: 'superdev@zelpay.solutions',
        id: '1234',
        active: true,
      }),
    } as any
  })
  const repository = container.get<ISuperBusinessRepository>(
    Locator.SuperBusinessRepository,
  )
  it("shouldn't find a business with wrong id", async () => {
    const superBusiness = { firestoreUid: '1111' }
    expect(repository.login(superBusiness)).rejects.toThrowError(
      'superbusiness not found',
    )
  })
  it('should find a business', async () => {
    const superBusiness = { firestoreUid: '1111' }
    const loadedSuperBusiness = await repository.login(superBusiness)
    expect(loadedSuperBusiness.email).toBe('superdev@zelpay.solutions')
  })
})
