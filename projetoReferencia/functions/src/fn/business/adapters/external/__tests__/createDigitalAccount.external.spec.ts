import 'reflect-metadata'
import { IBusiness } from '../../../entities/interfaces.entity'
import axios, { AxiosResponse } from 'axios'
import { CreateDigitalAccount } from '../createDigitalAccount.external'
import { mocked } from 'ts-jest/utils'
import { DomainError } from '../../../../../shared/errors/domain.error'

jest.mock('axios')
const mockedAxios = mocked(axios, true)

describe('createDigitalAccount function', () => {
  const businessToAdd: IBusiness = {
    birthDate: new Date(),
    name: 'User Cool Name',
    cnpj: '65.650.527/0001-07',
    cpf: '429.359.648-24',
    phone: '(11) 998785171',
    address: {
      street: 'Rua Macatuba',
      city: 'Itaquaquecetuba',
      number: '66',
      neighborhood: 'Estância Paraíso',
      postCode: '08592-510',
      state: 'SP',
      complement: 'Bloco B',
    },
    bank: {
      number: '260',
      account: '231321',
      agency: '6882-9',
    },
  }
  const createDigitalAccount = new CreateDigitalAccount()
  it('should create a digital account in third-party payment partner', async () => {
    mockedAxios.mockResolvedValue({
      data: {
        resourceToken: 'sometoken',
        paymentId: 'someid',
      },
    } as AxiosResponse)
    const account: IBusiness = await createDigitalAccount.call({
      ...businessToAdd,
      authToken: 'someauthtoken',
    })
    expect(account).toBeDefined()
    expect(account.resourceToken).toBe('sometoken')
    expect(account.paymentId).toBe('someid')
  })
  it('should create a digital account in third-party payment partner with all parameters', async () => {
    mockedAxios.mockResolvedValue({
      data: {
        resourceToken: 'sometoken',
        paymentId: 'someid',
      },
    } as AxiosResponse)
    const account: IBusiness = await createDigitalAccount.call({
      ...businessToAdd,
      businessArea: 1003,
      companyType: 'LTDA',
      authToken: 'someauthtoken',
    })
    expect(account).toBeDefined()
    expect(account.resourceToken).toBe('sometoken')
    expect(account.paymentId).toBe('someid')
  })
  it('should try to create a digital account but there is an unmapped error', async () => {
    mockedAxios.mockRejectedValue({
      response: {
        data: {
          details: [
            {
              errorCode: '333',
              message: 'someerror',
            },
          ],
        },
      },
    })
    try {
      await createDigitalAccount.call({
        ...businessToAdd,
        authToken: 'someauthtoken',
      } as IBusiness & { authToken: string })
    } catch (err) {
      expect(err).toBeDefined()
      const domainerror: DomainError = err
      expect(domainerror.errorCode).toBe('333')
      expect(domainerror.message).toBe('someerror')
    }
  })
  it('should try to create a digital account but account already exists', async () => {
    mockedAxios.mockRejectedValue({
      response: {
        data: {
          details: [
            {
              errorCode: '391004',
              message: 'Ação não permitida.',
            },
          ],
        },
      },
    })
    try {
      await createDigitalAccount.call({
        ...businessToAdd,
        authToken: 'someauthtoken',
      } as IBusiness & { authToken: string })
    } catch (err) {
      expect(err).toBeDefined()
      const domainerror: DomainError = err
      expect(domainerror.errorCode).toBe('391004')
      expect(domainerror.message).toBe('Conta digital já existe.')
    }
  })
})
