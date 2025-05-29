import 'reflect-metadata'
import { ValidateEpisodeUseCase } from '../validate.episode.usecase'
import { mocked } from 'ts-jest/utils'
import { container } from '../../../../business/shared/di.container'
import { IEpisode } from '../../../entities/interfaces'

jest.mock('../../../../business/shared/di.container')
const mockedContainer = mocked(container, true)
mockedContainer.get.mockImplementation(() => {
  return {
    checkBusinessExists: jest
      .fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ active: true })
      .mockImplementationOnce(() => {
        throw new Error('someerror')
      }),
  }
})
const validateEpisode = new ValidateEpisodeUseCase()
describe('episode validations', () => {
  it('should not validate becase fields are wrong', async () => {
    const episode = {
      name: 1234, //number is wrong type for name
    }
    const result = await validateEpisode.validate(episode as any)
    expect(result.error).toBeDefined()
    expect(result.error.message).toBe('"name" must be a string')
  })

  it('should not validate episode because it doesnt have a business', async () => {
    const episode = {}
    const result = await validateEpisode.validate(episode as any)
    expect(result.error).toBeDefined()
    expect(result.error.message).toBe('"business" is required')
  })

  it('should not validate episode because business was not found', async () => {
    const episode: IEpisode = {
      business: {
        id: '1234',
      },
      address: {
        text: 'someaddresstext',
        placeId: 'someid',
      },
    }

    const result = await validateEpisode.validate(episode as any)
    expect(result.error).toBeDefined()
    expect(result.error.message).toBe('Business não existe.')
  })

  it('should validate an episode creation', async () => {
    const episode: IEpisode = {
      business: {
        id: '1234',
      },
      address: {
        text: 'someaddresstext',
        placeId: 'someid',
      },
    }
    const result = await validateEpisode.validate(episode as any)
    expect(result.error).toBeUndefined()
  })

  it('should not validate episode cause there are errors in repository connection', async () => {
    const episode: IEpisode = {
      business: {
        id: '1234',
      },
      address: {
        text: 'Some Address Text',
        placeId: 'someplaceid',
      },
    }
    const result = await validateEpisode.validate(episode as any)
    expect(result.error).toBeDefined()
    expect(result.error.message).toBe('Não conseguimos checar o business.')
  })
})
