/**
 * @interface
 * Classe que faz o intermédio da comunicação entre a camada de casos de uso e a controladora, a interface tem como objetivo
 * abstrair status do caso de uso, se funcionou ou não, para algo que seja de fácil entendimento.
 * Possui duas implementações, `Failure` e `Success` , o retorno de uma instância de Success significa que o caso de uso teve sucesso
 * e seu valor é o esperado para o retorno do método, o retorno de Success significa que o caso de uso não conseguiu ser executado
 * e algo deu errado.
 *  A Interface dispõe de três métodos básicos (getValue, isSuccess e isFailure), que são utilizados para fazer a decisão sobre o resultado
 * da execução do caso de uso.
 */
export interface Either {
  /**
     * @returns true se a instância for Failure, ou false se for uma instãncia de Success
     */
  isFailure: () => boolean
  /**
     * @returns true se a instância for Success, ou false se for uma instãncia de Failure
     */
  isSuccess: () => boolean
  /**
     * @returns o valor da instância.
     */
  getValue: () => any
}
/**
 * @class
 * Implementação de Either, para ver mais sobre a motivação, veja a documentação sobre Either.
 * A criação de um Failure, recebe um genérico E que será o tipo do valor inserido na instância.
 * O retorno de Failure significa que ocorreu um problema durante a execução do caso de uso.
 */
export class Failure<E> implements Either {
  readonly value: E | string

  constructor (value?: E) {
    this.value = value ?? 'no content'
  }

  getValue (): E | string {
    return this.value
  }

  isFailure (): boolean {
    return true
  }

  isSuccess (): boolean {
    return false
  }
}

/**
 * @class
 * Implementação de Either, para ver mais sobre a motivação, veja a documentação sobre Either.
 * A criação de um Success, recebe um genérico E que será o tipo do valor inserido na instância.
 * O retorno de Success significa o caso de uso executou normalmente e teve o resultado esperado.
 */
export class Success<E> implements Either {
  readonly value: E

  constructor (value: E) {
    this.value = value
  }

  getValue (): E {
    return this.value
  }

  isFailure (): boolean {
    return false
  }

  isSuccess (): boolean {
    return true
  }
}
