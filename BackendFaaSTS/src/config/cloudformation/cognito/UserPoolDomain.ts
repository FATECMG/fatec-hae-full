const UserPoolDomain = {
    CognitoUserPoolDomain: {
      Type: 'AWS::Cognito::UserPoolDomain',
      Properties: {
        Domain: "${self:service}-${self:provider.stage}-${self:provider.region}-confirm-user",
        UserPoolId: {
          Ref: 'CognitoUserPool',
        }
      }
    }
}

export default UserPoolDomain