import {
  TABLE_NAME,
  documentClient
} from 'root/src/server/util/dynamoClient'
import {
  PARTITION_KEY,
  SORT_KEY
} from 'root/src/shared/constants/apiDynamoIndexes'
import {
	length
} from 'ramda'
export default async ({
  payload
}) => {
  const {
    deviceIds,
    selectedUserId
  } = payload
  // Get all boards
  await documentClient.put({
    TableName: TABLE_NAME,
    Item: {
      [PARTITION_KEY]: 'user-data',
      [SORT_KEY]: selectedUserId,
      allowDevices: length(deviceIds) ? deviceIds : ','
    }
  })


  return {}
}
