import 'reflect-metadata'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import { Locator } from '../../shared/di.enums'
import { ItemPhotos, UploadPhotos } from '../../usecases/uploadPhotos.usecase'

@injectable()
export class UploadItemImage implements Handler {
  constructor(@inject(Locator.UploadPhotos) usecase: UploadPhotos) {
    this._usecase = usecase
  }
  readonly _usecase: UploadPhotos

  async handle(req: Request): Promise<ResponseReturn> {
    const item = req.body
    await this._usecase.exec(item as ItemPhotos)
    return { statusCode: 200 }
  }
}
