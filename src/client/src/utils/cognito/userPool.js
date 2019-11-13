import outputs from '@root/cfOutput'
import CognitoUserPool from 'amazon-cognito-identity-js/lib/CognitoUserPool'

const {
  userPoolId,
  clientId
} = outputs

export default new CognitoUserPool({
  UserPoolId: userPoolId,
  ClientId: clientId
})
