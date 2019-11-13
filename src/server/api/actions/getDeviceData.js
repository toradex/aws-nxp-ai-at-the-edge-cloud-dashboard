import {
  TABLE_NAME,
  documentClient
} from 'root/src/server/util/dynamoClient'
import {
  PARTITION_KEY,
  SORT_KEY
} from 'root/src/shared/constants/apiDynamoIndexes'
import {
  dynamoItemsProp,
} from 'root/src/shared/descriptions/apiLenses'

import deviceTypes, {
  INFERENCE
} from 'root/src/shared/constants/deviceTypes'
import pastaTypes from 'root/src/shared/constants/pastaTypes'
import {
  map,
  reduce,
} from 'ramda'

import getDevicesForUser from 'root/src/server/api/actionUtils/getDevicesForUser'

export default async ({
  userId
}) => {
  const devicesForUser = await getDevicesForUser(userId)

  const arrDdbToData = (dDbData) => reduce((res, data) => [...res, ...dynamoItemsProp(data)], [], dDbData)

  // Get all boards

  const allBoardsDdb = await Promise.all(devicesForUser.map(async (board) => {
    const boardData = await documentClient.query({
      TableName: TABLE_NAME,
      KeyConditionExpression: `${PARTITION_KEY} = :pk and ${SORT_KEY} = :sk`,
      ExpressionAttributeValues: {
        ':pk': 'board-detail',
        ':sk': board
      },
    })
    return boardData
  }))

  const allBoards = arrDdbToData(allBoardsDdb)

  const getQuery = (board, deviceId, type) => ({
    TableName: TABLE_NAME,
    KeyConditionExpression: `${PARTITION_KEY} = :pk and ${SORT_KEY} = :sk`,
    ExpressionAttributeValues: {
      ':pk': deviceId,
      ':sk': `${type}-${board}`
    },
  })
  const allDeviceDataByBoard = await Promise.all(devicesForUser.map(async (board) => {
    // Get all average device Data
    const averageDeviceDataDdb = await Promise.all(
      map(async (device) => await documentClient.query(getQuery(board, device.id, 'average')), deviceTypes)
    )
    const averageDeviceData = arrDdbToData(averageDeviceDataDdb)

    // Get all last device Data
    const lastDeviceDataDdb = await Promise.all(
      map(async (device) => await documentClient.query(getQuery(board, device.id, 'last')), deviceTypes)
    )
    const lastDeviceData = arrDdbToData(lastDeviceDataDdb)

    // Get all average pasta Data
    const averagePastaDataDdb = await Promise.all(
      map(async (pasta) => await documentClient.query(getQuery(board, `${INFERENCE.id}-${pasta.sId}`, 'average')), pastaTypes)
    )
    const averagePastaData = arrDdbToData(averagePastaDataDdb)
    // Get all last pasta Data
    const lastPastaDataDdb = await Promise.all(
      map(async (pasta) => await documentClient.query(getQuery(board, `${INFERENCE.id}-${pasta.sId}`, 'last')), pastaTypes)
    )
    const lastPastaData = arrDdbToData(lastPastaDataDdb)
    return [...averageDeviceData, ...lastDeviceData, ...averagePastaData, ...lastPastaData]
  }))

  const allDeviceDataArr = reduce((res, arr) => [...res, ...arr], [], allDeviceDataByBoard)

  return {
    allBoards,
    deviceData: allDeviceDataArr,
  }
}
