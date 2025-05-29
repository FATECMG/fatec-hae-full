
/**
 * @interface
 * CourseDTO is an interface that encapsulates the data that is received from the client to interact with course resources.
 * It is used to create a Course entity.
 * The DTO stands for Data Transfer Object.
 * @see
 * - {@link ../Course.ts}
 * - {@link https://en.wikipedia.org/wiki/Data_transfer_object}
 */
export interface CourseDTO {
  name: string
  acronym: string
  code: string
  schedule: string[]
  coordinator: string
  active?: boolean
}
