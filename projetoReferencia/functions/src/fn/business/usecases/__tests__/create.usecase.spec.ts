import 'reflect-metadata'
import { Locator } from '../../shared/di.enums'
import { ICreateUseCase } from '../interfaces.usecases'
import { mocked } from 'ts-jest/utils'
import { warmConnections } from '../../../..'
import axios, { AxiosResponse } from 'axios'
import { Container } from 'inversify'
import { CreateUseCase } from '../create.usecase'
import { IBusinessRepository } from '../../adapters/repositories/interfaces.repository'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { getAuthorizationToken } from '../../../../shared/adapters/external/getAuthTokenFromJuno.external'
import { IAddress } from '../../../address/entities/interfaces.entity'
import { IEpisode } from '../../../episodes/entities/interfaces'
import { IContract } from '../../../contracts/entities/interfaces'

jest.mock('../../../..')
const mockedWarmConnections = mocked(warmConnections, true)

jest.mock('axios')
const mockedAxios = mocked(axios, true)

jest.mock('mongoose', () => {
  return {
    model: jest.fn().mockReturnValue({
      create: jest.fn().mockImplementation(() => {
        return {
          _id: 'someid',
          id: 'someid',
        }
      }),
    }),
    Schema: class Schema {},
  }
})

jest.mock('../../../../shared/adapters/external/getAuthTokenFromJuno.external')
const mockedGetAuthorizationToken = mocked(getAuthorizationToken, true)

const container = new Container()

describe('business create usecase', () => {
  beforeAll(() => {
    mockedWarmConnections.mockResolvedValue()
    mockedAxios.mockResolvedValueOnce({
      data: { street: 'some street' },
    } as AxiosResponse)
    container.bind<ICreateUseCase>(Locator.CreateUseCase).to(CreateUseCase)
    const MockedRepository = jest.fn().mockImplementation(() => {
      return {
        create: async () => Promise.resolve({ id: 'someidaaa' }),
        checkAdminExists: jest
          .fn()
          .mockResolvedValueOnce({ id: 'adminid' })
          .mockResolvedValueOnce(null),
      }
    })
    container
      .bind<IBusinessRepository>(Locator.BusinessRepository)
      .toConstantValue(new MockedRepository())
    const FakeExternal = jest.fn().mockImplementation(() => ({
      call: jest
        .fn()
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({ _embedded: { documents: [{}, {}, {}] } }),
    }))
    const fakeExternal = new FakeExternal()
    container
      .bind<IExternal<any, any>>(Locator.CreateDigitalAccountExternal)
      .toConstantValue(fakeExternal)
    container
      .bind<IExternal<any, any>>(Locator.GetDigitalAccountPublicKeyExternal)
      .toConstantValue(fakeExternal)
    container
      .bind<IExternal<any, any>>(Locator.GetMissingDocumentsExternal)
      .toConstantValue(fakeExternal)
    container
      .bind<IExternal<any, any>>(Locator.CreateFirebaseAccountExternal)
      .toConstantValue(fakeExternal)
    container
      .bind<IExternal<string, IAddress>>(Locator.ComposeAddressPlaceIdExternal)
      .toConstantValue(fakeExternal)
    const MockCreateEpisodeExternal = jest.fn().mockImplementation(() => {
      return {
        call: jest.fn().mockResolvedValue(null),
      }
    })
    const mockCreateEpisodeExternal = new MockCreateEpisodeExternal()
    container
      .bind<IExternal<IEpisode, void>>(Locator.CreateEpisodeExternal)
      .toConstantValue(mockCreateEpisodeExternal)
    const MockCreateContractExternal = jest.fn().mockImplementation(() => {
      return {
        call: jest.fn().mockResolvedValue(null),
      }
    })
    const mockCreateContractExternal = new MockCreateContractExternal()
    container
      .bind<IExternal<IContract, void>>(Locator.CreateContractExternal)
      .toConstantValue(mockCreateContractExternal)
  })
  it("should not create an user because it's not valid", async () => {
    const createUsecase = container.get<ICreateUseCase>(Locator.CreateUseCase)
    try {
      await createUsecase.create({ name: 'Andrew', type: 'Business' })
    } catch (error) {
      expect(error.message).toBe('"email" is required')
    }
  })
  it('should pass validation and create an user on mongodb', async () => {
    mockedGetAuthorizationToken.mockResolvedValue('someauthtoken')
    const createUsecase = container.get<ICreateUseCase>(Locator.CreateUseCase)
    const business = {
      birthDate: new Date(),
      name: 'User Cool Name',
      cnpj: '65.650.527/0001-07',
      password: '123456',
      email: 'somecooldev@zelpay.solutions',
      cpf: '429.359.648-24',
      type: 'Business',
      createdBy: {
        text: 'self',
      },
      phone: '(11) 998785171',
      address: {
        text: 'Rua Macatuba',
        placeId: 'ChIJxfGTSPd7zpQRiBrHt8DtKhI',
      },
      bank: {
        number: '260',
        account: '231321',
        agency: '6882-9',
      },
    }
    const createdBusiness = await createUsecase.create(business)
    expect(createdBusiness).toBeDefined()
    expect(createdBusiness.id).toBe('someidaaa')
  })
  it('should pass validation but admin wasnt found', async () => {
    const createUsecase = container.get<ICreateUseCase>(Locator.CreateUseCase)
    const business = {
      birthDate: new Date(),
      name: 'User Cool Name',
      cnpj: '65.650.527/0001-07',
      password: '123456',
      email: 'somecooldev@zelpay.solutions',
      cpf: '429.359.648-24',
      type: 'Business',
      createdBy: {
        text: 'admin',
        user: {
          id: 'idinvalid',
        },
      },
      phone: '(11) 998785171',
      address: {
        text: 'Rua Macatuba',
        placeId: 'ChIJxfGTSPd7zpQRiBrHt8DtKhI',
      },
      bank: {
        number: '260',
        account: '231321',
        agency: '6882-9',
      },
    }
    expect(createUsecase.create(business)).rejects.toThrow(
      "admin couldn't be found",
    )
  })
  it('should try to create an admin with no admin privileges', async () => {
    const createUsecase = container.get<ICreateUseCase>(Locator.CreateUseCase)
    const business = {
      birthDate: new Date(),
      name: 'User Cool Name',
      cnpj: '65.650.527/0001-07',
      password: '123456',
      email: 'somecooldev@zelpay.solutions',
      cpf: '429.359.648-24',
      type: 'Administrador',
      createdBy: {
        text: 'self',
      },
      phone: '(11) 998785171',
      address: {
        text: 'Rua Macatuba',
        placeId: 'ChIJxfGTSPd7zpQRiBrHt8DtKhI',
      },
      bank: {
        number: '260',
        account: '231321',
        agency: '6882-9',
      },
    }
    expect(createUsecase.create(business)).rejects.toThrow(
      'only admins can create admins',
    )
  })
  it('should try to create an superb with no admin privileges', async () => {
    const createUsecase = container.get<ICreateUseCase>(Locator.CreateUseCase)
    const business = { type: 'SuperB' } as any
    await expect(createUsecase.create(business)).rejects.toThrow(
      'only admins can create superb',
    )
  })
  it('should try to create an superb with no admin privileges', async () => {
    const createUsecase = container.get<ICreateUseCase>(Locator.CreateUseCase)
    const business = {
      type: 'SuperB',
      createdBy: { text: 'admin', user: { id: '321' } },
    } as any
    await expect(createUsecase.create(business)).rejects.toThrow(
      '"email" is required',
    )
  })
})
