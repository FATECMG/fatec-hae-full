import 'reflect-metadata'
import { Container } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { ISuperBusinessRepository } from '../../adapters/repositories/interfaces.repositories'
import { ISuperBusiness } from '../../entities/interfaces.entities'
import { Locator } from '../../shared/di.enums'
import { ISuperBusinessUseCase } from '../interfaces.usecases'
import { SuperBusinessUseCase } from '../superbusiness.usecase'
import { DomainError } from '../../../../shared/errors/domain.error'

const container = new Container()
container
  .bind<ISuperBusinessUseCase>(Locator.SuperBusinessUseCase)
  .to(SuperBusinessUseCase)
const MockSuperBusinessRepository = jest.fn().mockImplementation(() => {
  return {
    login: jest
      .fn()
      .mockImplementationOnce(async () => {
        throw new DomainError({
          errorCode: '',
          message: 'superbusiness not found',
        })
      })
      .mockImplementationOnce(async () => {
        return { id: '1234' }
      }),
  }
})
const mockSuperBusinessRepository = new MockSuperBusinessRepository()
container
  .bind<ISuperBusinessRepository>(Locator.SuperBusinessRepository)
  .toConstantValue(mockSuperBusinessRepository)
const MockSuperBusinessLoginFirebaseExternal = jest
  .fn()
  .mockImplementation(() => {
    return {
      call: jest
        .fn()
        .mockRejectedValueOnce({ message: 'invalid credential' })
        .mockResolvedValueOnce({ firestoreUid: '1111', jwt: '123abc' })
        .mockResolvedValueOnce({ firestoreUid: '1111', jwt: '123abc' }),
    }
  })
const mockSuperBusinessLoginFirebaseExternal = new MockSuperBusinessLoginFirebaseExternal()
container
  .bind<IExternal<ISuperBusiness, ISuperBusiness>>(
    Locator.SuperBusinessLoginFirebaseExternal,
  )
  .toConstantValue(mockSuperBusinessLoginFirebaseExternal)
describe('login superbusiness usecase', () => {
  const usecase = container.get<ISuperBusinessUseCase>(
    Locator.SuperBusinessUseCase,
  )
  it('should not login user because is bad credentials', async () => {
    expect(
      usecase.login({ email: 'superdev@zelpay.solutions', password: '1234' }),
    ).rejects.toMatchObject({ message: 'invalid credential' })
  })

  it("should login but it's not superbusinesstype", async () => {
    expect(
      usecase.login({ email: 'superdev@zelpay.solutions', password: '1234' }),
    ).rejects.toThrowError('superbusiness not found')
  })

  it('should login', async () => {
    const superb = await usecase.login({
      email: 'superdev@zelpay.solutions',
      password: '1232',
    })
    expect(superb.jwt).toBe('123abc')
  })
})
