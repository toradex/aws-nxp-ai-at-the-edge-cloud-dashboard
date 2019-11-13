import {
  ref
} from 'root/src/aws/util/functions'

import {
  USER_POOL,
  USER_POOL_CLIENT,
  IDENTITY_POOL
} from 'root/src/aws/cognito/resourceIds'

const IDENTITY_POOL_ID = 'identityPoolId'
const CLIENT_ID = 'clientId'
const USER_POOL_ID = 'userPoolId'


export default {
  [USER_POOL_ID]: {
    Description: 'User pool ID',
    Value: ref(USER_POOL)
  },
  [IDENTITY_POOL_ID]: {
    Description: 'Identity pool ID',
    Value: ref(IDENTITY_POOL)
  },
  [CLIENT_ID]: {
    Description: 'Client id for the user pool appclient',
    Value: ref(USER_POOL_CLIENT)
  }
}
