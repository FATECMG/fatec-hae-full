import 'reflect-metadata'

import { type Mapper } from '@common/mapper/BaseMapper'
import { type IHttpClient } from '@common/http/Client'
import { AxiosHttpClient } from '@common/external/http/AxiosHttpClient'
import { type NewValidationSchema } from '@common/validation/Validate'

import { AddressLocator } from '@functions/address/shared/Di.enums'
import { type AddressUseCases } from '@functions/address/useCases/AddressUseCases.interface'
import { ViaCepAddressUseCases } from '@functions/address/adapter/useCases/ViaCepAddressUseCases'
import { AddressController } from '@functions/address/controller/AddressController'
import { type ViaCepAddress } from '@functions/address/entities/dto/ViaCepAddress'
import { type Address } from '@functions/address/entities/Address'
import { ViaCepToAddressMapper } from '@functions/address/adapter/mapper/ViaCepToAddressMapper'
import { CepZodValidation } from '@functions/address/adapter/validation/ZodValidation'

import { Container } from 'inversify'

export const AddressContainer = new Container()

AddressContainer.bind<AddressUseCases>(AddressLocator.AddressUseCases)
  .to(ViaCepAddressUseCases)

AddressContainer.bind<AddressController>(AddressLocator.AddressController)
  .to(AddressController)

AddressContainer.bind<Mapper<ViaCepAddress, Address>>(AddressLocator.AddressMapper)
  .to(ViaCepToAddressMapper)

AddressContainer.bind<IHttpClient>(AddressLocator.HttpClient)
  .to(AxiosHttpClient)

AddressContainer.bind<NewValidationSchema>(AddressLocator.AddressValidation)
  .to(CepZodValidation)
