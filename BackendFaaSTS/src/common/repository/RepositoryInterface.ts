import { type User } from '@functions/user/entities/User'

export interface SaveEntityRepository <E> {
  perform: (entity: E) => Promise<E>
}

export interface FindOneEntityRepository <E> {
  perform: (id: string) => Promise<E | undefined>
}

export interface FindAllEntityRepository <E> {
  perform: (active: boolean) => Promise<E[]>
}

export interface FindAllEntityWithFilterRepository <E, P> {
  perform: (params: P) => Promise<E[]>
}

export interface UpdateEntityRepository <E> {
  perform: (entity: E, id: string) => Promise<E | undefined>
}

export interface DeleteEntityRepository {
  perform: (id: string) => Promise<boolean>
}

export interface DeactivateEntityRepository <E> {
  perform: (id: string) => Promise<boolean>
}

export interface ActivateEntityRepository <E> {
  perform: (id: string) => Promise<boolean>
}

export interface FindAllFromEntityRepository <E> {
  perform: (id: string) => Promise<E[]>
}

export interface FindUserByEmailRepository {
  perform: (email: string) => Promise<User | undefined>
}
