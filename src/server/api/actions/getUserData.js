import {
  CognitoIdentityServiceProvider
} from 'aws-sdk'
import outputs from 'root/cfOutput'
import {
  getTail
} from 'root/src/shared/util/ramdaPlus'

const {
  userPoolId
} = outputs

export default async ({
  userId
}) => {
  const provider = new CognitoIdentityServiceProvider()
  const id = getTail('-', userId)
  const userData = await provider.adminGetUser({
    Username: id,
    UserPoolId: userPoolId
  }).promise()
  return userData || 'not found'
}
