import { IItemEntity } from '../../../entities/item.entity'
import { ValidateManyItemCreation } from '../createMany.item.usecase.validations'

describe('Create many items validations', () => {
  it('should not validate an item because is invalid', async () => {
    const result = await new ValidateManyItemCreation().validate([
      { name: 'Teste', type: 'Batata', hasPhotos: false },
    ] as IItemEntity[])

    expect(result.error).toBeDefined()
    expect(result.error.message).toBe('Tipo inválido')
  })
})
