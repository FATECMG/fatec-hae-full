import { connectDatabase } from '@common/external/database/MongoDB'
import { type DeactivateEntityRepository } from '@common/repository/RepositoryInterface'

import { UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'
import { type User } from '@functions/user/entities/User'

import { injectable } from 'inversify'

@injectable()
export class DeactivateUserRepository implements DeactivateEntityRepository<User> {
  async perform (id: string): Promise<boolean> {
    await connectDatabase()
    const userDeactivated = await UserModel.findOneAndUpdate({ id }, { active: false }, { new: true })
    return !(userDeactivated == null) && !userDeactivated.active
  }
}
