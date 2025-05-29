import 'reflect-metadata'
import { Handler } from '../../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../../shared/di.enums'
import { Request } from 'express'
import { Container } from 'inversify'
import { CreateController } from '../create.controller'
import { ICreateUseCase } from '../../../usecases/interfaces.usecases'

jest.mock('mongoose', () => ({
  model: jest.fn().mockReturnValue({
    create: jest.fn().mockImplementation(async () => {
      return {
        _id: 'someid',
        id: 'someid',
      }
    }),
  }),
  Schema: class Schema {},
}))
let container: Container
const MockCreateUseCase = jest.fn().mockImplementation(() => {
  return {
    create: jest.fn().mockResolvedValue({ id: 'someid' }),
  }
})
describe('create business controller', () => {
  beforeAll(() => {
    container = new Container()
    container.bind<Handler>(Locator.CreateController).to(CreateController)
    container
      .bind<ICreateUseCase>(Locator.CreateUseCase)
      .toConstantValue(new MockCreateUseCase())
  })
  it('should not create a business case validation wont pass', async () => {
    const createController = container.get<Handler>(Locator.CreateController)
    try {
      await createController.handle({} as Request)
      throw new Error('should not reach here')
    } catch (error) {
      expect(error.message).toBe('No business provided')
    }
  })
  it('should create user', async () => {
    const createController = container.get<Handler>(Locator.CreateController)
    const business = await createController.handle({
      body: {
        business: {
          birthDate: '19-08-1994',
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
        },
      },
    } as Request)
    expect(business).toBeDefined()
    expect(business.body.id).toBe('someid')
  })
})
