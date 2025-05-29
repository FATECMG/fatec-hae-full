/**
 * @interface
 * CoursePresentationModel interface represents the resource that will be sent to the client.
 * @see {@link https://martinfowler.com/eaaDev/PresentationModel.html}
 */
export interface CoursePresentationModel {
  id: string
  name: string
  acronym: string
  code: string
  schedule: string[]
  coordinator: string
  active: boolean
}
