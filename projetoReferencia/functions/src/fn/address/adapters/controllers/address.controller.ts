import { Handler } from '../../../../shared/adapters/controllers/interfaces'
import { container } from '../../shared/di.container'
import { Locator } from '../../shared/di.enums'
import express from 'express'
import main from '../../../../shared/adapters/controllers/main'

const composeAddressByPlaceIdController = container.get<Handler>(
  Locator.ComposeByPlaceIdController,
)
const address = express()

address.get(
  '/composebyplaceid/:placeId',
  main(composeAddressByPlaceIdController),
)

export default address
