export const CourseLocator = {
  CourseDTOMapper: Symbol.for('CourseDTOMapper'),
  CoursePresentationModelMapper: Symbol.for('CoursePresentationModelMapper'),
  CourseDTOSchemaValidation: Symbol.for('CourseDTOSchemaValidation'),
  CourseNameAndIdPMMapper: Symbol.for('CourseNameAndIdPM'),

  CourseFindOneRepository: Symbol.for('CourseFindOneRepository'),
  CourseFindAllRepository: Symbol.for('CourseFindAllRepository'),
  CourseCreateRepository: Symbol.for('CourseCreateRepository'),
  CourseUpdateRepository: Symbol.for('CourseUpdateRepository'),
  CourseDeleteRepository: Symbol.for('CourseDeleteRepository'),
  CourseActivateRepository: Symbol.for('CourseActivateRepository'),
  CourseDeactivateRepository: Symbol.for('CourseDeactivateRepository'),

  CourseFindOneUseCase: Symbol.for('CourseFindOneUseCase'),
  CourseFindAllUseCase: Symbol.for('CourseFindAllUseCase'),
  CourseCreateUseCase: Symbol.for('CourseCreateUseCase'),
  CourseUpdateUseCase: Symbol.for('CourseUpdateUseCase'),
  CourseDeleteUseCase: Symbol.for('CourseDeleteUseCase'),
  CourseActivateUseCase: Symbol.for('CourseActivateUseCase'),
  CourseDeactivateUseCase: Symbol.for('CourseDeactivateUseCase'),

  CourseFindOneController: Symbol.for('CourseFindOneController'),
  CourseFindAllController: Symbol.for('CourseFindAllController'),
  CourseCreateController: Symbol.for('CourseCreateController'),
  CourseUpdateController: Symbol.for('CourseUpdateController'),
  CourseDeleteController: Symbol.for('CourseDeleteController'),
  CourseActivateController: Symbol.for('CourseActivateController'),
  CourseDeactivateController: Symbol.for('CourseDeactivateController'),
  CourseFindAllNameAndIdController: Symbol.for('CourseFindAllNameAndIdController')
}
