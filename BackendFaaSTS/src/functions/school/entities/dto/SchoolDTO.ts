import { type AddressDTO } from '@functions/school/entities/dto/AddressDTO'
import { type Address } from '@functions/school/entities/Address'

export type SchoolDtoProps = {
  name: string
  address: AddressDTO
  active?: boolean
}

/**
 * @class
 * Classe que representa a entrada de dados para a atualização ou criação de uma nova escola.
 *
 * @constructor
 * Recebe obrigatoriamente um nome e um objeto de endereço, a propriedade ativa é opcional, mas caso não
 * seja definida, ela vai receber true como padrão.
 *
 * Caso deseje ver mais informações sobre validações do dados veja `school/adapter/validation/ZodValidation`
 */
export class SchoolDTO {
  name: string
  address: Address
  active: boolean

  constructor ({ name, address, active }: SchoolDtoProps) {
    this.name = name
    this.address = {
      city: address.city,
      complement: address.complement,
      district: address.district,
      number: address.number,
      postCode: address.postCode,
      state: address.state,
      street: address.street
    }
    this.active = active ?? true
  }
}
