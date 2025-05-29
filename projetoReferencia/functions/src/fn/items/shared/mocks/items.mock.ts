import { IItemEntity } from '../../entities/item.entity'

export const SimpleItem: IItemEntity = {
  price: 10,
  name: 'Item Simples',
  prepareTime: 10, // Em minutos
  description: 'Descrição opcional',
  type: 'Alimentício',
}

export const SimpleItemWithComplement: IItemEntity = {
  price: 10,
  name: 'Item Simples com Adicional',
  prepareTime: 10, // Em minutos
  type: 'Alimentício',
  complements: [
    {
      item: '605be2c52088ff1675fbaf62', // Item ID
      price: 1,
    },
  ],
}
