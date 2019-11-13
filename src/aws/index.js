import {
  cognitoResources,
  cognitoOutputs
} from 'root/src/aws/cognito'
import {
  staticHostingResources,
  staticHostingOutputs
} from 'root/src/aws/staticHosting'
import {
  apiResources,
  apiOutputs,
  apiAuthPolicies,
  apiUnauthPolicies
} from 'root/src/aws/api'

import {
  COGNITO_AUTH_ROLE,
  COGNITO_UNAUTH_ROLE
} from 'root/src/aws/cognito/resourceIds'

import {
  lensPath,
  compose,
  over,
  concat
} from 'ramda'

const pathCommon = ['Properties', 'Policies', 0, 'PolicyDocument', 'Statement']

const authPolicyLens = lensPath([COGNITO_AUTH_ROLE, ...pathCommon])

const unAuthPolicyLens = lensPath([COGNITO_UNAUTH_ROLE, ...pathCommon])

const addCognitoPolicies = (cognitoResources, authPolicies, unAuthPolicies) => compose(
  over(authPolicyLens, concat(authPolicies)),
  over(unAuthPolicyLens, concat(unAuthPolicies))
)(cognitoResources)

const appendedCognitoResources = addCognitoPolicies(
  cognitoResources,
  [
    ...apiAuthPolicies
  ],
  [
    ...apiUnauthPolicies
  ]
)

export default {
  Resources: {
    ...appendedCognitoResources,
    ...apiResources,
    ...staticHostingResources
  },
  Outputs: {
    ...cognitoOutputs,
    ...apiOutputs,
    ...staticHostingOutputs
  }
}
