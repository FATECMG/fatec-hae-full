import { type academicTitles } from '@functions/user/entities/User'

/**
 * @interface
 * UserPresentationModel interface represents the resource that will be sent to the client.
 * @see {@link https://martinfowler.com/eaaDev/PresentationModel.html}
 */
export interface UserPresentationModel {
  id: string
  name: string
  email: string
  phone: string
  courses: UserCoursePM[]
  roles: string
  registerNumber: string
  active: boolean
  academicTitle: academicTitles
}

export interface UserCoursePM {
  id: string
  name: string
}

export interface UserNameAndIdPresentationModel {
  id: string
  name: string
}
