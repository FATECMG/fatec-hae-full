export interface IExternal<I, O> {
  call: (args: I) => Promise<O>
}
