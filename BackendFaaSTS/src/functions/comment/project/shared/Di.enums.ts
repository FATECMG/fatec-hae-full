export const CommentMapperLocator = {
  CommentMapper: Symbol.for('CommentMapper'),
  CommentPresentationModelMapper: Symbol.for('CommentPresentationModelMapper')
}

export const CommentProjectSchemaValidationLocator = {
  CommentDTONewValidationSchema: Symbol.for('CommentDTONewValidationSchema')
}

export const CommentProjectControllerLocator = {
  CreateCommentProjectController: Symbol.for('CreateCommentProjectController'),
  FindAllCommentsFromProjectController: Symbol.for('FindAllCommentsFromProjectController')
}

export const CommentProjectUseCaseLocator = {
  CreateCommentProjectUseCase: Symbol.for('CreateCommentProjectUseCase'),
  FindAllCommentsFromProjectUseCase: Symbol.for('FindAllCommentsFromProjectUseCase')
}

export const CommentProjectRepositoryLocator = {
  CreateCommentProjectRepository: Symbol.for('CreateCommentProjectRepository'),
  FindAllCommentsFromProjectRepository: Symbol.for('FindAllCommentsFromProjectRepository')
}
