import { type Filter } from '@common/utils/filter/Filter'
import { Status } from '@functions/project/entities/enums/ProjectEnums'

export interface ProjectFilterProps extends Filter {
  status?: string[]
}
const defaultStatus = [
  Status.APPROVED.toString(),
  Status.REJECTED.toString(),
  Status.SENT.toString(),
  Status.UNDER_VALIDATION.toString(),
  Status.RETURNED_FOR_CORRECTION.toString()
]

export class ProjectFilter implements Filter {
  status: string[]
  active: boolean

  private constructor (props: ProjectFilterProps) {
    /**
     * If the status is not provided, the default status will be used.
     * If the status are provided, it will be used only the valid ones.
    */
    if (props.status !== undefined) {
      /**
       * This validation is necessary because when handling the request with express when
       * is sent a single status it behaves like a string, but when it is sent with more than one
       * status it behaves like an array.
       */
      if (typeof props.status === 'string') {
        props.status = [props.status]
      }

      if (props.status.length > 0) {
        props.status = props.status.map(status => status.toUpperCase())

        props.status = props.status
          .filter(status => status !== Status.DRAFT)
          .filter(status => defaultStatus.includes(status))
      }

      this.status = props.status.length <= 0 ? defaultStatus : props.status
    } else {
      this.status = defaultStatus
    }

    this.active = props.active ?? true
  }

  static create (props: ProjectFilterProps): ProjectFilter {
    return new ProjectFilter(props)
  }
}
