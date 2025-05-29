import { InfraError } from '@common/error/InfraError'

import { type GenerateUrlInterface, type GenerateUrlRequest } from '@functions/utils/s3urls/entities/GeneratePostUrl'

import { inject, injectable } from 'inversify'
import { GeneratePreSignedUrlError } from '@common/error/GeneratePreSignedUrlError'
import { GenerateUrlServiceLocator } from '@functions/utils/s3urls/shared/Di.enums'
import { IDNotFoundError } from '@common/error/NotFoundError'
import { GeneratePreSignedURLInterface } from '@common/s3url/GeneratePreSignedURL.interface'

export interface GeneratePreSignedUrlGetUseCase {
  execute: (params: GenerateUrlRequest) => Promise<GenerateUrlInterface[] | Error>
}

@injectable()
export class GenerateGetURL implements GeneratePreSignedUrlGetUseCase {
  constructor (
    @inject(GenerateUrlServiceLocator.GeneratePreSignedURLS3)
    private readonly service: GeneratePreSignedURLInterface) {}

  async execute (params: GenerateUrlRequest): Promise<GenerateUrlInterface[] | Error> {
    try {
      const postUrl = await this.service.getPreSignedGetURLs(this.createPrefix(params.resourceId, params.resourceType))

      if (postUrl instanceof Error) {
        throw new GeneratePreSignedUrlError()
      }

      return postUrl.map(url => ({ url }))
    } catch (error) {
      if (error instanceof GeneratePreSignedUrlError) throw error

      if (error instanceof IDNotFoundError) throw error

      throw new InfraError('Erro Inesperado!')
    }
  }

  private createPrefix (resourceId: string, resourceType: string): string {
    return `${resourceType}/${resourceId}/`
  }
}
