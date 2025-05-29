import type BaseEntity from '@common/entity/BaseEntity'
import { findMatchingEnumValue } from '@common/validation/EnumValueValidation'
import { v4 as uuid } from 'uuid'

export interface ReportAttachment {
  fileName: string
  description: string | undefined
}

export interface AttachmentProps {
  path: string
  fileName: string
  description: string
}

enum FileExtension {
  PDF = 'pdf',
  DOC = 'doc',
  DOCX = 'docx',
  JPEG = 'jpeg',
  PNG = 'png'
}

export class Attachment implements BaseEntity {
  id: string
  fileName: string
  path: string
  description: string | undefined
  fileExtension: string | undefined
  mimeType: string | undefined
  active: boolean

  constructor (props: AttachmentProps) {
    this.id = uuid()
    this.path = props.path

    if (props.fileName === undefined) { throw new Error('File name is undefined') }

    this.fileName = props.fileName.split('.')[0]
    this.fileExtension = findMatchingEnumValue(props.fileName.split('.')[1], FileExtension)

    if (this.fileExtension === undefined) { throw new Error('File extension is undefined') }

    props.description ? this.description = props.description : this.description = ''

    this.active = true
  }
}
