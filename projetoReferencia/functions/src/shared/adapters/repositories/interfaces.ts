export default interface Repository {
  connect: () => void
}

export interface ICountedList<T> {
  hasMore: boolean
  total: number
  list: Array<T>
}
