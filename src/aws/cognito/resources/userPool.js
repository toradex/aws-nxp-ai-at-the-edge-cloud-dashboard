import {
  USER_POOL
} from 'root/src/aws/cognito/resourceIds'
import {
  API_LAMBDA_FUNCTION
} from 'root/src/aws/api/resourceIds'

export default {
  [USER_POOL]: {
    Type: 'AWS::Cognito::UserPool',
    DependsOn: [
      API_LAMBDA_FUNCTION
    ],
    Properties: {
      UsernameAttributes: ['email'],
      AutoVerifiedAttributes: ['email'],
      EmailVerificationSubject: 'Your verification code',
      EmailVerificationMessage: 'Your verification code is {####}.',
      UserPoolName: USER_POOL
    }
  }
}
