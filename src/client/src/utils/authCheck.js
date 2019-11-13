import jwt from 'jsonwebtoken'
import {
  contains,
  pathOr,
  hasPath
} from 'ramda'
import {
  authenticated,
  unauthenticated,
  everyone
} from '@root/src/shared/constants/authenticationTypes'

export default (idToken, authType) => {
  if (contains(authType, [unauthenticated, everyone])) return true
  const decoded = jwt.decode(idToken, {
    complete: true
  })
  if (authType == authenticated && hasPath(['payload'], decoded)) return true
  return contains(authType, pathOr([], ['payload', 'cognito:groups'], decoded))
}
