import equals from 'ramda/src/equals'
import contains from 'ramda/src/contains'
import propOr from 'ramda/src/propOr'
import prop from 'ramda/src/prop'
import { authorizationError } from 'root/src/server/api/errors'
import { userPk } from 'root/src/server/util/pkMaker'
import getCognitoUser from 'root/src/server/util/getCognitoUser'
import { authenticated } from 'root/src/shared/constants/authenticationTypes'
import { getAuthentication } from 'root/src/shared/descriptions/getEndpointDesc'

export const authorizeRequestHof = (
  getAuthenticationFn, getCognitoUserFn
) => async (endpointId, authentication) => {
  const authenticationRequired = getAuthenticationFn(endpointId)
  let cognito = {}
  if (authentication) {
    cognito = await getCognitoUserFn(authentication)
  }
  const { error, cognitoUser } = cognito
  if (error && authenticationRequired) {
    throw authorizationError(error)
  }
  if (authenticationRequired && !equals(authenticationRequired, authenticated)) {
    const cognitoGroups = propOr([], 'cognito:groups', cognitoUser)
    const invalidAuthentication = !contains(authenticationRequired, cognitoGroups)
    if (invalidAuthentication) {
      throw authorizationError('Must be admin user')
    }
  }
  return cognitoUser && userPk(prop('sub', cognitoUser))
}

export default authorizeRequestHof(getAuthentication, getCognitoUser)
