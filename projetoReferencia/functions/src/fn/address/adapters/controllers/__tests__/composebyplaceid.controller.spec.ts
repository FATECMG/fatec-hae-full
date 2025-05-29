import 'reflect-metadata'
import { Handler } from '../../../../../shared/adapters/controllers/interfaces'
import { container } from '../../../shared/di.container'
import { Locator } from '../../../shared/di.enums'
import { Request } from 'express'

describe('composebyid.controller', () => {
  const composebyidcontroller = container.get<Handler>(
    Locator.ComposeByPlaceIdController,
  )
  it('should fail at validating an empty placeid', async () => {
    try {
      await composebyidcontroller.handle({ params: {} } as Request)
      throw new Error("shouldn't never reach here")
    } catch (err) {
      expect(err.message).toBe('No placeId provided')
    }
  })
  it('should get an address given the correct placeId', async () => {
    const address = await composebyidcontroller.handle({
      params: { placeId: 'ChIJxfGTSPd7zpQRiBrHt8DtKhI' },
    } as any)
    expect(address).toBeDefined()
    expect(address.body.city).toBe('Itaquaquecetuba')
    expect(address.body.neighborhood).toBe('Estância Paraíso')
    expect(address.body.street).toBe('R. Macatuba')
  })
})
