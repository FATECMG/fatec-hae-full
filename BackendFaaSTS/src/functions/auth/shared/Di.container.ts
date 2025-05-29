import 'reflect-metadata'
import { Container } from 'inversify'

import { type FindUserByEmailRepository } from '@common/repository/RepositoryInterface'
import { type NewValidationSchema } from '@common/validation/Validate'
import { type CompareEncryptedString } from '@common/encryption/Encrypt'
import { BCryptCompareEncryptedValues } from '@common/utils/encryption/BCryptEncryption'

import { FindUserByEmailMongoRepository } from '@functions/auth/adapter/repository/MongoDB/AuthRepository'
import { AuthLocator, AuthenticatorLocator } from '@functions/auth/shared/Di.enums'
import { AuthUseCase } from '@functions/auth/useCases/AuthUseCase'
import { type AuthenticateUseCase } from '@functions/auth/useCases/Interface'
import { AuthController } from '@functions/auth/controller/AuthController'
import { AuthZodValidation } from '@functions/auth/adapter/validation/AuthValidation'
import { CognitoAuthenticationService } from '@common/auth/cognito/CognitoAuthenticationService'
import { SignUpUseCase } from '@functions/auth/useCases/SignUpUseCase'
import { GetUserByTokenUseCase } from '../useCases/GetUserByTokenUseCase'
import { GetUserByTokenController } from '../controller/GetUserByTokenController'
import { RequestUserDataValidation } from '../adapter/validation/AuthRequestUserData'
import { type AuthenticationService } from '@common/auth/AuthenticationService.interface'

export const AuthContainer = new Container()

AuthContainer.bind<FindUserByEmailRepository>(AuthLocator.AuthRepository)
  .to(FindUserByEmailMongoRepository)

AuthContainer.bind<AuthenticateUseCase>(AuthLocator.AuthUseCase)
  .to(AuthUseCase)

AuthContainer.bind<AuthController>(AuthLocator.AuthController)
  .to(AuthController)

AuthContainer.bind<NewValidationSchema>(AuthLocator.AuthValidation)
  .to(AuthZodValidation)

AuthContainer.bind<CompareEncryptedString>(AuthLocator.AuthCompareEncryptedString)
  .to(BCryptCompareEncryptedValues)

AuthContainer
  .bind<AuthenticationService>(AuthenticatorLocator.CognitoAuthenticationService)
  .to(CognitoAuthenticationService)

AuthContainer
  .bind<SignUpUseCase>(AuthLocator.SignUpUseCase)
  .to(SignUpUseCase)

AuthContainer
  .bind<GetUserByTokenUseCase>(AuthLocator.GetUserByTokenUseCase)
  .to(GetUserByTokenUseCase)

AuthContainer
  .bind<GetUserByTokenController>(AuthLocator.GetUserByTokenController)
  .to(GetUserByTokenController)

AuthContainer
  .bind<NewValidationSchema>(AuthLocator.RequestUserDataValidation)
  .to(RequestUserDataValidation)
