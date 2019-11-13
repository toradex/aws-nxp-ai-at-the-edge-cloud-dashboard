import reduce from 'ramda/src/reduce'
import jwt from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'

import nodeAjax from 'root/src/shared/util/nodeAjax'
import outputs from 'root/cfOutput'
import { region } from 'root/src/shared/constants/aws'

const { userPoolId } = outputs
const issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`

const convertKeysToPems = (userPoolKeys) => {
  const { keys } = userPoolKeys
  const pems = reduce((results, key) => {
    const jwk = { kty: key.kty, n: key.n, e: key.e }
    const keyId = key.kid
    return { [keyId]: jwkToPem(jwk), ...results }
  }, {}, keys)
  return pems
}

const verifyJwt = (token, pem) => new Promise((resolve) => {
  jwt.verify(token, pem, { issuer }, (error, userData) => {
    resolve({ error, userData })
  })
})

export default async (token) => {
  const userPoolKeys = await nodeAjax({
    url: `${issuer}/.well-known/jwks.json`
  })

  const pems = convertKeysToPems(userPoolKeys)
  const decodedJwt = jwt.decode(token, { complete: true })

  // Fail if the token is not jwt
  if (!decodedJwt) {
    return { error: 'Not a valid JWT token' }
  }

  // Fail if token is not from your UserPool
  if (decodedJwt.payload.iss !== issuer) {
    return { error: 'Unauthorized, incorrect issuer' }
  }

  // Reject the jwt if it's not an 'Access Token'
  if (decodedJwt.payload.token_use !== 'id') {
    return { error: 'Unauthorized, not an id token' }
  }

  // // Get the kid from the token and retrieve corresponding PEM
  const { kid } = decodedJwt.header
  const pem = pems[kid]
  if (!pem) {
    return { error: 'Unauthorized, not good' }
  }

  // Verify the signature of the JWT token to ensure it's really coming from
  // your User Pool
  const { error, userData } = await verifyJwt(token, pem)
  if (error) {
    return { error }
  }
  return { cognitoUser: userData }
}
