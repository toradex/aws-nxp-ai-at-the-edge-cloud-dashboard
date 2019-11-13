import {
  ref
} from 'root/src/aws/util/functions'

import {
  COGNITO_UNAUTH_ROLE,
  IDENTITY_POOL
} from 'root/src/aws/cognito/resourceIds'

export default {
  [COGNITO_UNAUTH_ROLE]: {
    Type: 'AWS::IAM::Role',
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
        PolicyName: 'cognitounauth',
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [{
            Effect: 'Allow',
            Action: [
              'cognito-sync:*'
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
