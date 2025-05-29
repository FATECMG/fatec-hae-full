import { InfraError } from '@common/error/InfraError'
import { GeneratePreSignedUrlError } from '@common/error/GeneratePreSignedUrlError'

import { type GenerateUrlInterface, type PostURLRequest } from '@functions/utils/s3urls/entities/GeneratePostUrl'

import { GenerateUrlServiceLocator } from '@functions/utils/s3urls/shared/Di.enums'
import { GeneratePreSignedURLInterface } from '@common/s3url/GeneratePreSignedURL.interface'

import { createKeyContext } from '../keys/CreateKey'

import { inject, injectable } from 'inversify'
export interface GeneratePreSignedPostUrlUseCase {
  execute: (params: PostURLRequest) => Promise<GenerateUrlInterface[] | Error>
}

@injectable()
export class GeneratePostURL implements GeneratePreSignedPostUrlUseCase {
  constructor (
    @inject(GenerateUrlServiceLocator.GeneratePreSignedURLS3)
    private readonly service: GeneratePreSignedURLInterface) {}

  async execute (params: PostURLRequest): Promise<GenerateUrlInterface[] | Error> {
    try {
      const getUrl = await this.createUrls(params)

      if (getUrl instanceof Error) {
        throw new GeneratePreSignedUrlError()
      }

      return getUrl.map(url => ({ url }))
    } catch (error) {
      if (error instanceof GeneratePreSignedUrlError) throw error

      throw new InfraError('Erro Inesperado!')
    }
  }

  private async createUrls (params: PostURLRequest): Promise<string[] | Error> {
    try {
      const result: any = []

      for (let i = 0; i < params.files.length; i++) {
        const key = createKeyContext(params.resourceType).execute({
          prefix: params.resourceId,
          fileType: params.files[i].type,
          fileName: params.files[i].name
        })
        const url = await this.service.getPreSignedPostURLs(key)

        result.push(url)
      }

      return result
    } catch (error) {
      if (error instanceof GeneratePreSignedUrlError) throw error

      throw new InfraError('Erro Inesperado!')
    }
  }
}
