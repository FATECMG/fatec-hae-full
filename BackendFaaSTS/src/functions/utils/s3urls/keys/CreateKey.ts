import { v4 as uuid } from 'uuid'
import { CreateKeyContext, type CreateKeyParams } from './CreateKeyContext'
import { GeneratePreSignedUrlError } from '@common/error/GeneratePreSignedUrlError'

interface ParamsWithResource extends CreateKeyParams {
  path: string
}

const createKey = ({ path, prefix, fileType, fileName }: ParamsWithResource): string => {
  const date = new Date().toLocaleDateString().replaceAll('/', '')
  const time = new Date().toLocaleTimeString().replaceAll(':', '')

  const dateTime = `${date}-${time}`
  const commonPath = path
  let extension = 'webp'

  if (fileType !== undefined && !fileType?.includes('image')) {
    extension = fileType
  }

  console.log(`${commonPath}/${prefix}/${dateTime}-${uuid()}.${extension}/${fileName}`)

  return `${commonPath}/${prefix}/${dateTime}-${uuid()}.${extension}/${fileName}`
}

export interface CreateKeyInterface {
  execute: (params: CreateKeyParams) => string
}

class CreateReportKey implements CreateKeyInterface {
  execute (params: CreateKeyParams): string {
    const path = 'reports'
    return createKey({ ...params, path })
  }
}

export const createKeyContext = (prefix: string): CreateKeyContext => {
  if (prefix === 'reports') {
    return new CreateKeyContext(new CreateReportKey())
  }

  throw new GeneratePreSignedUrlError()
}
