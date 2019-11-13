import {
  ref
} from 'root/src/aws/util/functions'
import {
  COGNITO_AUTH_ROLE,
  IDENTITY_POOL
} from 'root/src/aws/cognito/resourceIds'

export default {
  [COGNITO_AUTH_ROLE]: {
    Type: 'AWS::IAM::Role',
    DependsOn: [
      IDENTITY_POOL
    ],
    Properties: {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Sid: '',
          Effect: 'Allow',
          Principal: {
            Federated: 'cognito-identity.amazonaws.com'
          },
          Action: 'sts:AssumeRoleWithWebIdentity',
          Condition: {
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': ref(
                IDENTITY_POOL
              )
            }
          }
        }]
      },
      Policies: [{
        PolicyName: 'cognitoauth',
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [{
            Effect: 'Allow',
            Action: [
              'cognito-sync:*',
              'execute-api:*'
            ],
            Resource: [
              '*'
            ]
          }]
        }
      }]
    }
  }
}
