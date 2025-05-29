const UserPool = {
    CognitoUserPool: {
        Type: 'AWS::Cognito::UserPool',
        DeletionPolicy: 'Retain',
        UpdatePolicy: {
          "Retain": "true",
        },
        Properties: {
          UserPoolName: '${self:service}-${self:provider.stage}-${self:provider.region}-user-pool',
          MfaConfiguration: 'OFF',
          DeletionProtection: 'ACTIVE',
          AdminCreateUserConfig: {
            AllowAdminCreateUserOnly: false,
          },
          AccountRecoverySetting: {
            RecoveryMechanisms: [
              {
                Name: 'verified_email',
                Priority: 1,
              },
            ],
          },
          UsernameAttributes:['email'],
          EmailConfiguration: {
            EmailSendingAccount: 'COGNITO_DEFAULT',

          },
          VerificationMessageTemplate: {
            DefaultEmailOption: 'CONFIRM_WITH_LINK',
          },
          Policies:{
            PasswordPolicy: {
              MinimumLength: 10,
              RequireLowercase: true,
              RequireNumbers: true,
              RequireSymbols: true,
              RequireUppercase: true,
              TemporaryPasswordValidityDays: 7,
            },
          },
          UserAttributeUpdateSettings: {
            AttributesRequireVerificationBeforeUpdate: ['email']
          },
          AutoVerifiedAttributes: ['email'],
          Schema: [
            {
              Name: 'email',
              Required: true,
              Mutable: true,
              AttributeDataType: 'String'
            },
            {
              Name: 'name',
              Required: true,
              Mutable: true,
              AttributeDataType: 'String'
            },
            {
              Name: 'id',
              Required: false,
              Mutable: false,
              AttributeDataType: 'String'
            },
            {
              Name: 'role',
              Required: false,
              Mutable: true,
              AttributeDataType: 'String'
            },
          ],
      },
    },
}

export default UserPool