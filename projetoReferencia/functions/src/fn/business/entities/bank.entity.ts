import { IBank } from './interfaces.entity'

export class Bank implements IBank {
  constructor(bank?: IBank) {
    this.name = bank?.name
    this.number = bank?.number
  }

  private _name: string
  public get name(): string {
    return this._name
  }
  public set name(value: string) {
    this._name = value
  }

  private _number: string
  public get number(): string {
    return this._number
  }
  public set number(value: string) {
    this._number = value
  }
}
