import {
  CognitoIdentityServiceProvider
} from 'aws-sdk'
import outputs from 'root/cfOutput'
const {
  userPoolId
} = outputs

export default async () => {
  const provider = new CognitoIdentityServiceProvider()
  const params = {
    UserPoolId: userPoolId
  }
  const userList = await provider.listUsers(params).promise()
  return userList
}
