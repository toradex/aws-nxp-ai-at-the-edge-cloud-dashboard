import {
  ref
} from 'root/src/aws/util/functions'

import {
  ADMIN_USER_POOL_GROUP,
  USER_POOL
} from 'root/src/aws/cognito/resourceIds'

export default {
  [ADMIN_USER_POOL_GROUP]: {
    Type: 'AWS::Cognito::UserPoolGroup',
    DependsOn: [
      USER_POOL
    ],
    Properties: {
      GroupName: 'admin',
      UserPoolId: ref(USER_POOL)
    }
  }
}
