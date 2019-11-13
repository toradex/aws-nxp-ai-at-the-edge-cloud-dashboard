import {
  TABLE_NAME,
  documentClient
} from 'root/src/server/util/dynamoClient'
import {
  PARTITION_KEY,
  SORT_KEY
} from 'root/src/shared/constants/apiDynamoIndexes'

import deviceTypes, {
  INFERENCE
} from 'root/src/shared/constants/deviceTypes'
import pastaTypes from 'root/src/shared/constants/pastaTypes'
import {
  map,
  contains
} from 'ramda'

import getDevicesForUser from 'root/src/server/api/actionUtils/getDevicesForUser'

export default async ({
  userId,
  payload
}) => {
  const devicesForUser = await getDevicesForUser(userId)
  const {
    boardId
  } = payload

  // eslint-disable-next-line no-empty
  if (contains(boardId, devicesForUser)) {
    // Reset board

    await documentClient.put({
      TableName: TABLE_NAME,
      Item: {
        [PARTITION_KEY]: 'board-detail',
        [SORT_KEY]: boardId,
        beltSpeed: 0
      }
    })

    // Reset all average device data
    await Promise.all(
      map(async (device) => await documentClient.put({
        TableName: TABLE_NAME,
        Item: {
          [PARTITION_KEY]: device.id,
          [SORT_KEY]: `average-${boardId}`,
        }
      }), deviceTypes)
    )

    // Reset all last device data
    await Promise.all(
      map(async (device) => await documentClient.put({
        TableName: TABLE_NAME,
        Item: {
          [PARTITION_KEY]: device.id,
          [SORT_KEY]: `last-${boardId}`,
        }
      }), deviceTypes)
    )

    // Reset all average pasta Data
    await Promise.all(
      map(async (pasta) => await documentClient.put({
        TableName: TABLE_NAME,
        Item: {
          [PARTITION_KEY]: `${INFERENCE.id}-${pasta.sId}`,
          [SORT_KEY]: `average-${boardId}`,
        }
      }), pastaTypes)
    )
    // Reset all last pasta Data
    await Promise.all(
      map(async (pasta) => await documentClient.put({
        TableName: TABLE_NAME,
        Item: {
          [PARTITION_KEY]: `${INFERENCE.id}-${pasta.sId}`,
          [SORT_KEY]: `last-${boardId}`,
        }
      }), pastaTypes)
    )


    return {}
  } else {
    throw 'You don\'t have permission for this board'
  }
}
