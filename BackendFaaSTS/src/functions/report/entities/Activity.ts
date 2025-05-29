import { v4 as uuid } from 'uuid'
export interface ActivityProps {
  description: string
}

export class Activity {
  id: string
  description: string

  constructor (props: ActivityProps, id?: string) {
    this.id = id ?? uuid()
    this.description = props.description
  }
}
