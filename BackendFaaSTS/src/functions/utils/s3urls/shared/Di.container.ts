import 'reflect-metadata'

import { GeneratePostURLController } from '@functions/utils/s3urls/controller/GeneratePostUrlController'
import { GenerateGetURLController } from '@functions/utils/s3urls/controller/GenerateGetUrlController'
import { GenerateUrlControllerLocator, GenerateUrlServiceLocator, GenerateUrlUseCaseDTOValidationLocator, GenerateUrlUseCaseLocator } from '@functions/utils/s3urls/shared/Di.enums'
import { type GeneratePreSignedPostUrlUseCase, GeneratePostURL } from '@functions/utils/s3urls/usecases/GeneratePostUrl'
import { type NewValidationSchema } from '@common/validation/Validate'
import { GeneratePostUrlDTOZodValidation } from '@functions/utils/s3urls/adapter/validation/ZodGeneratePostUrlDTOValidation'
import { type GeneratePreSignedURLInterface } from '@common/s3url/GeneratePreSignedURL.interface'
import { GeneratePreSignedURL } from '@common/s3url/GeneratePreSignedURL'

import { Container } from 'inversify'
import { GenerateGetURL, type GeneratePreSignedUrlGetUseCase } from '../usecases/GenerateGetUrl'

export const PreSignedURLContainer = new Container()

PreSignedURLContainer
  .bind<GeneratePostURLController>(GenerateUrlControllerLocator.GeneratePostURLController)
  .to(GeneratePostURLController)

PreSignedURLContainer
  .bind<GeneratePreSignedPostUrlUseCase>(GenerateUrlUseCaseLocator.GeneratePostURL)
  .to(GeneratePostURL)

PreSignedURLContainer
  .bind<NewValidationSchema>(GenerateUrlUseCaseDTOValidationLocator.GeneratePostURLDTOValidation)
  .to(GeneratePostUrlDTOZodValidation)

PreSignedURLContainer
  .bind<GeneratePreSignedURLInterface>(GenerateUrlServiceLocator.GeneratePreSignedURLS3)
  .to(GeneratePreSignedURL)

PreSignedURLContainer
  .bind<GenerateGetURLController>(GenerateUrlControllerLocator.GenerateGetUrlController)
  .to(GenerateGetURLController)

PreSignedURLContainer
  .bind<GeneratePreSignedUrlGetUseCase>(GenerateUrlUseCaseLocator.GenerateGetURL)
  .to(GenerateGetURL)
