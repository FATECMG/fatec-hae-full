import { IEpisode } from '../../../entities/interfaces'
import { container } from '../../../shared/di.container'
import { Locator } from '../../../shared/di.enums'
import { IEpisodeRepository } from '../interfaces.repository'

describe('episodes repository', () => {
  const episodeRepository = container.get<IEpisodeRepository>(
    Locator.EpisodeRepository,
  )
  it('should not create episode cause required fields are missing', async () => {
    const episode = {} //missing required attributes
    await expect(episodeRepository.create(episode as IEpisode)).rejects.toThrow(
      'i dont know',
    )
  })
})
