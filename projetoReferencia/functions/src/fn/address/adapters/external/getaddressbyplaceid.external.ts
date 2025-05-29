import { IAddress } from '../../entities/interfaces.entity'
import {
  Client,
  Language,
  AddressComponent,
} from '@googlemaps/google-maps-services-js'
import { FIREBASEAPP } from '../../../../shared/config/params'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { injectable } from 'inversify'

@injectable()
export class GetAddressByPlaceIdExternal
  implements IExternal<string, IAddress> {
  getAddressComponentValueByType(
    addressComponents: AddressComponent[] | undefined,
    type: string,
  ): string {
    if (!addressComponents || addressComponents.length === 0) {
      return ''
    }
    const [{ short_name } = { short_name: '' }] = addressComponents.filter(
      addressComponent => {
        return addressComponent.types.some(_type => _type === type)
      },
    )
    return short_name
  }

  async call(placeId: string): Promise<IAddress> {
    const client = new Client({})
    const {
      data: {
        result: { address_components },
      },
    } = await client.placeDetails({
      params: {
        language: Language.pt_BR,
        place_id: placeId,
        key: FIREBASEAPP.apiKey,
      },
    })
    const postCode = this.getAddressComponentValueByType(
      address_components,
      'postal_code',
    )
    const street = this.getAddressComponentValueByType(
      address_components,
      'route',
    )
    const number = this.getAddressComponentValueByType(
      address_components,
      'street_number',
    )
    const neighborhood = this.getAddressComponentValueByType(
      address_components,
      'sublocality_level_1',
    )
    const city = this.getAddressComponentValueByType(
      address_components,
      'administrative_area_level_2',
    )
    const state = this.getAddressComponentValueByType(
      address_components,
      'administrative_area_level_1',
    )
    return {
      postCode,
      cep: postCode,
      street,
      number,
      neighborhood,
      city,
      state,
    }
  }
}
