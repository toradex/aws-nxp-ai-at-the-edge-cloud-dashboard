import invokeLambda from '~/utils/server/invokeLambda'
import outputs from '@root/cfOutput'
import {
  AuthService
} from '~/services/auth'
import showNotify from '~/utils/showNotify'
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
	const res = await invokeLambda(apiFunction, lambdaPayload)
	if ( res.statusCode != 200 ){
		showNotify(res.generalErrors)
	}
	return res
}
