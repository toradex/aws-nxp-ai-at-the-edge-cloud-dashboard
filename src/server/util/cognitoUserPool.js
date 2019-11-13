import outputs from 'root/cfOutput'
import {
  CognitoUserPool
} from 'amazon-cognito-identity-js-node'

const {
  userPoolId,
  clientId
} = outputs

export default new CognitoUserPool({
  UserPoolId: userPoolId,
  ClientId: clientId
})
