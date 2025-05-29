import 'reflect-metadata'

import { type NewValidationSchema } from '@common/validation/Validate'
import { ValidationError } from '@common/error/ValidationError'

import { AddressController } from '@functions/address/controller/AddressController'
import { type AddressUseCases } from '@functions/address/useCases/AddressUseCases.interface'

import { mock, type MockProxy } from 'jest-mock-extended'
import { InfraError } from '@common/error/InfraError'

describe('AddressController', () => {
  let systemUnderTest: AddressController
  let addressUseCases: MockProxy<AddressUseCases>
  let addressValidation: MockProxy<NewValidationSchema>

  beforeAll(() => {
    addressUseCases = mock()
    addressUseCases.getAddress.mockResolvedValue({
      street: 'any_street',
      complement: 'any_complement',
      district: 'any_district',
      city: 'any_city',
      state: 'any_state'
    })
    addressValidation = mock()
    addressValidation.validate.mockReturnValue(undefined)
    systemUnderTest = new AddressController(addressUseCases, addressValidation)
  })

  it('should call AddressUseCase and Validation with correct params', async () => {
    await systemUnderTest.handle('any_id')

    expect(addressValidation.validate).toHaveBeenCalledWith('any_id')
    expect(addressValidation.validate).toHaveBeenCalledTimes(1)
    expect(addressUseCases.getAddress).toHaveBeenCalledWith('any_id')
    expect(addressUseCases.getAddress).toHaveBeenCalledTimes(1)
  })

  it('should return 400 on Validation failure', async () => {
    addressValidation.validate.mockReturnValueOnce(new ValidationError([{ field: 'any_field', message: 'any_error' }]))

    const response = await systemUnderTest.handle('any_id')

    expect(response).toEqual({
      statusCode: 400,
      data: [{
        field: 'any_field',
        message: 'any_error'
      }]
    })
  })

  it('should return 400 on UseCase failure', async () => {
    addressUseCases.getAddress.mockResolvedValueOnce(new Error('any_data'))

    const response = await systemUnderTest.handle('any_id')

    expect(response).toEqual({
      statusCode: 400,
      data: 'any_data'
    })
  })

  it('should return 200 on success', async () => {
    const response = await systemUnderTest.handle('any_id')

    expect(response).toEqual({
      statusCode: 200,
      data: {
        street: 'any_street',
        complement: 'any_complement',
        district: 'any_district',
        city: 'any_city',
        state: 'any_state'
      }
    })
  })

  it('should return 500 on infra error', async () => {
    addressUseCases.getAddress.mockRejectedValueOnce(new InfraError('infra_error'))

    const response = await systemUnderTest.handle('any_id')

    expect(response).toEqual({
      statusCode: 500,
      data: 'infra_error'
    })
  })
})
