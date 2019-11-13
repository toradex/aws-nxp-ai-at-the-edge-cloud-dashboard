import {
  getAtt,
  ref,
} from 'root/src/aws/util/functions'
import {
  IDENTITY_POOL,
  USER_POOL_CLIENT,
  USER_POOL
} from 'root/src/aws/cognito/resourceIds'

export default {
  [IDENTITY_POOL]: {
    Type: 'AWS::Cognito::IdentityPool',
    Properties: {
      IdentityPoolName: IDENTITY_POOL,
      AllowUnauthenticatedIdentities: true,
      CognitoIdentityProviders: [{
        ClientId: ref(USER_POOL_CLIENT),
        ProviderName: getAtt(USER_POOL, 'ProviderName')
      }]
    }
  }
}
