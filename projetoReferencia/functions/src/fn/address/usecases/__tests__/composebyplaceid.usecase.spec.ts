import 'reflect-metadata'
import { container } from '../../shared/di.container'
import { Locator } from '../../shared/di.enums'
import { IComposeByPlaceIdUseCase } from '../interfaces.usecases'

describe('composebyplaceid.usecase', () => {
  const composebyplaceidusecase = container.get<IComposeByPlaceIdUseCase>(
    Locator.ComposeByPlaceIdUseCase,
  )
  it('should return a defined address given a correct placeId', async () => {
    const address = await composebyplaceidusecase.compose(
      'ChIJxfGTSPd7zpQRiBrHt8DtKhI',
    )
    expect(address).toBeDefined()
    expect(address.city).toBe('Itaquaquecetuba')
    expect(address.neighborhood).toBe('Estância Paraíso')
    expect(address.street).toBe('R. Macatuba')
  })
})
