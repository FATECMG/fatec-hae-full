import { type Dates } from '@functions/notice/useCases/ValidateNoticeDate'

export interface SaveUseCase<T> {
  execute: (param: T) => Promise<T | Error>
}

export interface SaveUseCaseFromInterface<T, I> {
  execute: (param: I) => Promise<T | Error>
}

export interface FindOneUseCase<T> {
  execute: (id: string) => Promise<T | Error>
}

export interface FindAllUseCase<T> {
  execute: (active: boolean) => Promise<T[]>
}

export interface FindAllWithFilterUseCase<T, F> {
  execute: (params: F) => Promise<T[]>
}

export interface UpdateUseCase<T> {
  execute: (id: string, entity: T) => Promise<T | Error>
}

export type DeleteResult = {
  deleted: boolean
  message: string
}

export interface DeleteUseCase {
  execute: (id: string) => Promise<DeleteResult>
}

export interface DeactivateUseCase<T> {
  execute: (id: string) => Promise<DeleteResult>
}

export interface ActivateUseCase<T> {
  execute: (id: string) => Promise<DeleteResult>
}

export interface FindAllFromEntityUseCase<T> {
  execute: (id: string) => Promise<T[]>
}

export interface ValidateNoticeDate {
  execute: (dates: Dates) => Promise<Error | undefined>
}

export interface UpdateStatusUseCaseProps {
  id: string
  status: string
  role: string
}

export interface UpdateStatusUseCase<T> {
  execute: (props: UpdateStatusUseCaseProps) => Promise<T | Error>
}