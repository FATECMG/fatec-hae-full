import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindUserByEmailRepository } from '@common/repository/RepositoryInterface'

import { toDomain } from '@functions/user/adapter/repositories/MongoDB/utils'
import { UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'
import { type User } from '@functions/user/entities/User'

import { injectable } from 'inversify'

@injectable()
export class FindUserByEmailMongoRepository implements FindUserByEmailRepository {
  async perform (email: string): Promise <User | undefined> {
    await connectDatabase()
    const result = await UserModel.findOne({ email })
    return result === null ? undefined : toDomain(result)
  }
}
