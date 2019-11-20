import {
  TABLE_NAME,
  documentClient
} from 'root/src/server/util/dynamoClient'
import {
  PARTITION_KEY,
  SORT_KEY
} from 'root/src/shared/constants/apiDynamoIndexes'
import getDevicesForUser from 'root/src/server/api/actionUtils/getDevicesForUser'
import { contains } from 'ramda'
import { generalError } from 'root/src/server/api/errors'


export default async ({
	payload, userId
}) => {
	const {
		deviceId,
    alias
  } = payload
	const devicesForUser = await getDevicesForUser(userId)
	if (!contains(deviceId, devicesForUser)) {
		throw generalError('There is not access for this Board!')
	}

  const res = await documentClient.update({
    TableName: TABLE_NAME,
    Key: {
      [PARTITION_KEY]: 'board-detail',
      [SORT_KEY]: deviceId,
		},
		UpdateExpression: 'SET #alias = :alias',
		ExpressionAttributeNames: { '#alias': 'alias' },
		ExpressionAttributeValues: {
			':alias': alias
		}
  })


  return res
}
