const UserPoolClient = {
    
    CognitoUserPoolClient: {
      Type: 'AWS::Cognito::UserPoolClient',
      DeletionPolicy: 'Retain',
      UpdatePolicy: {
        "Retain": "true",
      },
      Properties: {
        ClientName: '${self:service}-${self:provider.stage}-${self:provider.region}-client',
        GenerateSecret: true,
        AccessTokenValidity: 30,
        IdTokenValidity: 30,
        RefreshTokenValidity: 60,
        TokenValidityUnits: {
          AccessToken: 'minutes',
          IdToken: 'minutes',
          RefreshToken: 'minutes'
        },
        ExplicitAuthFlows: ['ALLOW_USER_PASSWORD_AUTH', 'ALLOW_REFRESH_TOKEN_AUTH'],
        EnableTokenRevocation: true,

        UserPoolId: {
          Ref: 'CognitoUserPool',
        },
      }
    }
}

export default UserPoolClient