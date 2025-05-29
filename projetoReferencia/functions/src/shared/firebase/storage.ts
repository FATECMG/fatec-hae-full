import { getFirebase } from './index'
import { v4 as uuidv4 } from 'uuid'

const firebase = getFirebase()
const storage = firebase.storage()

type UploadParams = {
  path: string
  file: {
    name: string
    content: string
    contentType: string
  }
}

type RemoveFileParams = {
  path: string
  url: string
}

export const upload = async ({ path, file }: UploadParams): Promise<string> => {
  const bucket = storage.bucket()
  const fileRef = bucket.file(`${path}/${file.name}`)

  const token = uuidv4()

  const buffer = extractBufferFromFile(file.content)
  await fileRef.save(buffer, {
    public: true,
    metadata: {
      contentType: file.contentType,
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  })

  return fileRef.publicUrl()
}

export const removeFile = async ({
  path,
  url,
}: RemoveFileParams): Promise<string> => {
  const bucket = storage.bucket()
  const fileRef = bucket.file(`${path}/${url}`)

  await fileRef.delete()
  return url
}

function extractBufferFromBase64(base64: string): Buffer {
  return Buffer.from(base64, 'base64')
}

function extractBufferFromFile(file: string): Buffer {
  let buffer
  if (typeof file === 'string') {
    const base64string = file.replace(/^data:image\/\w+;base64,/, '')
    buffer = extractBufferFromBase64(base64string)
  } else {
    buffer = file
  }
  return buffer
}
