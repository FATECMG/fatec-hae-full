export const AuthLocator = {
  AuthController: Symbol.for('AuthController'),
  AuthUseCase: Symbol.for('AuthUseCase'),
  AuthRepository: Symbol.for('AuthRepository'),
  AuthValidation: Symbol.for('AuthValidation'),
  AuthMapper: Symbol.for('AuthMapper'),
  AuthCompareEncryptedString: Symbol.for('AuthCompareEncryptedString'),
  SignUpUseCase: Symbol.for('SignUpUseCase'),
  GetUserByTokenUseCase: Symbol.for('GetUserByTokenUseCase'),
  GetUserByTokenController: Symbol.for('GetUserByTokenController'),
  RequestUserDataValidation: Symbol.for('RequestUserDataValidation')
}

export const AuthenticatorLocator = {
  CognitoAuthenticationService: Symbol.for('CognitoAuthenticationService')
}
