import { connectDatabase } from '@common/external/database/MongoDB'
import { type ActivateEntityRepository } from '@common/repository/RepositoryInterface'

import { UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'
import { type User } from '@functions/user/entities/User'

import { injectable } from 'inversify'

@injectable()
export class ActivateUserRepository implements ActivateEntityRepository<User> {
  async perform (id: string): Promise<boolean> {
    await connectDatabase()
    const userActivated = await UserModel.findOneAndUpdate({ id }, { active: true }, { new: true })
    return !(userActivated == null) && userActivated.active
  }
}
