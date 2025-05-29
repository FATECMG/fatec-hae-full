import type BaseEntity from '@common/entity/BaseEntity'
import { type Document } from 'mongoose'

export const toDomain = <T extends BaseEntity>(model: Document): T => {
  const { _id, __v, ...data } = model.toObject() // Exclui _id e __v, obtém as outras propriedades do objeto do modelo
  return data // Retorna um objeto T
}
