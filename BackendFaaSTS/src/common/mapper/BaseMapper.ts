/**
 * @interface
 * Interface base de mapeamento, ela recebe dois tipos genéricos, o primeiro deles é a tipo base e o segundo é o tipo alvo
 * do mapeamento.
 * Ela tem o propósito de mapeamento unidirecional, não tendo um segundo método que faça o mapeamento reverso.
 */
export interface Mapper<T, S> {
  execute: (entity: T) => Promise<S>
}
