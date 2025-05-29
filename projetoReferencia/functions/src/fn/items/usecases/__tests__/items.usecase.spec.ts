import 'reflect-metadata'
import { Container } from 'inversify'
import { IItemRepository } from '../../adapters/repositories/types'
import { IItemEntity } from '../../entities/item.entity'
import { Locator } from '../../shared/di.enums'
import { CreateManyItems, ICreateManyItems } from '../createMany.usecase'

describe('Create many items usecase', () => {
  const container = new Container()
  const MockItemRepository = jest.fn().mockImplementation(() => ({
    createMany: jest
      .fn()
      .mockImplementation((items: IItemEntity[]) =>
        items.map(i => ({ ...i, _id: 'ID TESTANDO' })),
      ),
  }))

  const mockItemRepository = new MockItemRepository()
  container
    .bind<IItemRepository>(Locator.ItemRepository)
    .toConstantValue(mockItemRepository)

  container
    .bind<ICreateManyItems>(Locator.CreateManyUseCase)
    .to(CreateManyItems)

  it('should not create because it fails in validations', async () => {
    const usecase = container.get<ICreateManyItems>(Locator.CreateManyUseCase)

    try {
      await usecase.createManyItems([{ name: 'Testando' }])
    } catch (error) {
      console.log(error.messsage)
      expect(error.message).toBe('Tipo inválido')
    }
  })

  it('should create because items is valid', async () => {
    const usecase = container.get<ICreateManyItems>(Locator.CreateManyUseCase)
    const result = await usecase.createManyItems([
      {
        name: 'Testando',
        type: 'Alimentício',
        hasPhotos: false,
        business: '5fb444bc35e91d3469106b1d',
      },
    ])

    expect(result).toHaveLength(1)

    result.map(item => {
      expect(item).toMatchObject({ _id: 'ID TESTANDO' })
    })
  })
})
