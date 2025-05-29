import { DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { InfraError } from '@common/error/InfraError'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GeneratePreSignedUrlError } from '@common/error/GeneratePreSignedUrlError'
import { type GeneratePreSignedURLInterface } from './GeneratePreSignedURL.interface'

import { injectable } from 'inversify'

@injectable()
export class GeneratePreSignedURL implements GeneratePreSignedURLInterface {
  private readonly s3: S3Client

  private readonly config = {
    region: process.env.AWS_REGION,
    s3Bucket: process.env.S3_BUCKET,
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET
  }

  constructor () {
    if (!this.config.region || !this.config.s3Bucket || !this.config.accessKeyId || !this.config.secretAccessKey) { throw new InfraError('Erro Inesperado!') }

    this.s3 = new S3Client({
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey
      }
    })
  }

  async deleteObjectsByPrefix (prefix: string): Promise<void | Error> {
    const keys = await this.getObjectKeysFromPrefix(prefix)

    if (keys.length === 0) {
      console.log('Nenhum objeto encontrado para exclusão.')
      return
    }

    const deleteParams = {
      Bucket: this.config.s3Bucket,
      Delete: { Objects: keys.map(key => ({ Key: key })) }
    }

    await this.s3.send(new DeleteObjectsCommand(deleteParams))
  }

  async getPreSignedGetURLs (prefix: string): Promise<string[] | Error> {
    try {
      const keys = await this.getObjectKeysFromPrefix(prefix)

      const preSignedURLs = await Promise.all(keys.map(async (key) => {
        return await getSignedUrl(
          this.s3,
          new GetObjectCommand({ Bucket: this.config.s3Bucket, Key: key }),
          { expiresIn: 3600 })
      }))

      return preSignedURLs
    } catch (error) {
      throw new GeneratePreSignedUrlError()
    }
  }

  async getPreSignedPostURLs (key: string): Promise<string | Error> {
    try {
      const preSignedURLs = await getSignedUrl(this.s3,
        new PutObjectCommand({
          Bucket: this.config.s3Bucket,
          Key: key
        }),
        { expiresIn: 3600 })

      return preSignedURLs
    } catch (error) {
      throw new GeneratePreSignedUrlError()
    }
  }

  private async getObjectKeysFromPrefix (prefix: string): Promise<string[]> {
    try {
      const buckeItems = await this.s3.send(new ListObjectsV2Command({ Bucket: this.config.s3Bucket, Prefix: prefix }))
      const keys = buckeItems.Contents?.map((content) => content.Key as string) ?? []
      return keys
    } catch (error) {
      console.log('s3 error', error)
      throw new GeneratePreSignedUrlError()
    }
  }
}
