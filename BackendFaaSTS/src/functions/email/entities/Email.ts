export class Email {
  from: string
  to: EmailAddress[]
  subject: string
  body: string
  cc?: string[]
  bcc?: string[]

  constructor (props: EmailProps) {
    this.from = props.from
    this.to = props.to
    this.subject = props.subject
    this.body = props.body
    this.bcc = props.bcc
    this.cc = props.cc
  }
}

export interface EmailProps {
  from: string
  to: EmailAddress[]
  subject: string
  body: string
  cc?: string[]
  bcc?: string[]
}

export interface EmailAddress {
  name: string
  address: string
}
