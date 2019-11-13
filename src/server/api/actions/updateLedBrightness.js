import {
  TABLE_NAME,
  documentClient
} from 'root/src/server/util/dynamoClient'
import {
  PARTITION_KEY,
  SORT_KEY
} from 'root/src/shared/constants/apiDynamoIndexes'
import getDevicesForUser from 'root/src/server/api/actionUtils/getDevicesForUser'
import {
  contains
} from 'ramda'
import publishDataToMQTT from 'root/src/server/api/actionUtils/publishDataToMQTT'

export default async ({
  payload,
  userId
}) => {
  const devicesForUser = await getDevicesForUser(userId)
  const {
    deviceId,
    ledBrightness
  } = payload
  // eslint-disable-next-line no-empty
  if (contains(deviceId, devicesForUser)) {
    await documentClient.put({
      TableName: TABLE_NAME,
      Item: {
        [PARTITION_KEY]: 'led-brightness',
        [SORT_KEY]: deviceId,
        ledBrightness
      }
    })

    const res = await publishDataToMQTT(`led/${deviceId}/brightness`, `{
      "brightness": ${ledBrightness}
    }`)
    return {
      res
    }
  } else {
    throw 'You don\'t have permission for this board'
  }
}
