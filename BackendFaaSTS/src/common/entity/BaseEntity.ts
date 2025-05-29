/**
 * @interface
 * BaseEntity represents a common entity in the database.
 * Only domain entities should implement this interface.
 * Classes that implement it carry the data between the repository and use-case layer.
 * Classes that implement BaseEntity will have the following properties:
 * - id: string
 * - active: boolean
 */
export default interface BaseEntity {
  id: string
  active: boolean
}
