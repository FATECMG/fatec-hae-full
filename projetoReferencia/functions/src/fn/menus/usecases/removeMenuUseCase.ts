import { inject, injectable } from 'inversify'
import { IEpisodeRepository } from '../../episodes/adapters/repositories/interfaces.repository'
import { IMenuRepository } from '../adapters/repositories/types'
import { Locator } from '../shared/di.enums'

export interface IRemoveMenuUseCase {
  removeMenu(menuId: string, episodeId: string): Promise<void>
}

@injectable()
export class RemoveMenuUseCase implements IRemoveMenuUseCase {
  constructor(
    @inject(Locator.MenuRepository) private repo: IMenuRepository,
    @inject(Locator.EpisodeRepository) private episodeRepo: IEpisodeRepository,
  ) {}
  async removeMenu(menuId: string, episodeId: string): Promise<void> {
    await this.episodeRepo.updateById(
      episodeId,
      undefined,
      undefined,
      undefined,
      {
        menus: { $in: [menuId] },
      },
    )

    await this.repo.update({ _id: menuId }, { active: false }, undefined)
  }
}
