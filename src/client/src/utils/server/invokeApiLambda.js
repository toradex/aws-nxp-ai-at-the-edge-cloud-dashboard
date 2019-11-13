import invokeLambda from '~/utils/server/invokeLambda'
import outputs from '@root/cfOutput'
import {
  AuthService
} from '~/services/auth'

const {
  apiFunctionArn,
} = outputs

export default async (endpointId, payload) => {
  const jwtToken = await AuthService.getJwtToken()
  const lambdaPayload = {
    endpointId,
    payload,
    ...(jwtToken ? {
      authentication: jwtToken
    } : {}),
  }
  const apiFunction = apiFunctionArn
  return invokeLambda(apiFunction, lambdaPayload)
}
