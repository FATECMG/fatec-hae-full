import { type Role } from '@functions/role/entities/Role'

export interface IRoleRepository {
  findAll: () => Promise<Role[]>
}
