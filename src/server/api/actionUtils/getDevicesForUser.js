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
import getAllBoardData from './getAllBoardDatas'

import {
  head,
  propOr,
  split,
  length,
	filter,
	map
} from 'ramda'
import {
  getTail
} from 'root/src/shared/util/ramdaPlus'

export default async (userId) => {
  const realUserId = getTail('-', userId)
  // Get boardIds that user can access
  const userDatasDdb = await documentClient.query({
    TableName: TABLE_NAME,
    KeyConditionExpression: `${PARTITION_KEY} = :pk and ${SORT_KEY} = :sk`,
    ExpressionAttributeValues: {
      ':pk': 'user-data',
      ':sk': realUserId
    },
	})

	const allBoardData = await getAllBoardData()
	let devicesForUser = []
	if (length(dynamoItemsProp(userDatasDdb))){
		devicesForUser = filter((element) => length(element) && element != ',',
      split(',', propOr('', 'allowDevices', head(dynamoItemsProp(userDatasDdb))))
		)
	} else {
		devicesForUser = map(board => propOr('none', 'sk', board), allBoardData)
	}
  return devicesForUser
}
