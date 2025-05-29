import { type Role } from '@functions/role/entities/Role'

export interface IRoleUseCases {
  findAll: () => Promise<Role[]>
}
