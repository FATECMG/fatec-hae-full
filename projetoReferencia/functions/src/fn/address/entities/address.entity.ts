import { IAddress } from './interfaces.entity'

export class Address implements IAddress {
  constructor(address?: IAddress) {
    this.city = address?.city
    this.complement = address?.complement
    this.neighborhood = address?.neighborhood
    this.number = address?.number
    this.placeId = address?.placeId
    this.postCode = address?.postCode
    this.state = address?.state
    this.street = address?.street
    this.text = address?.text
  }
  private _complement: string
  public get complement(): string {
    return this._complement
  }
  public set complement(value: string) {
    this._complement = value
  }
  private _neighborhood: string
  public get neighborhood(): string {
    return this._neighborhood
  }
  public set neighborhood(value: string) {
    this._neighborhood = value
  }
  private _city: string
  public get city(): string {
    return this._city
  }
  public set city(value: string) {
    this._city = value
  }
  private _state: string
  public get state(): string {
    return this._state
  }
  public set state(value: string) {
    this._state = value
  }
  private _postCode: string
  public get postCode(): string {
    return this._postCode
  }
  public set postCode(value: string) {
    this._postCode = value
  }
  private _placeId: string
  public get placeId(): string {
    return this._placeId
  }
  public set placeId(value: string) {
    this._placeId = value
  }
  private _text: string
  public get text(): string {
    return this._text
  }
  public set text(value: string) {
    this._text = value
  }
  private _street: string
  public get street(): string {
    return this._street
  }
  public set street(value: string) {
    this._street = value
  }
  private _number: string
  public get number(): string {
    return this._number
  }
  public set number(value: string) {
    this._number = value
  }
}
