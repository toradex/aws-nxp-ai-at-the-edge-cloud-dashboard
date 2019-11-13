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

import {
  head,
  propOr,
  split,
  length,
  filter
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

  const devicesForUser = filter((element) => length(element),
    split(',', propOr('', 'allowDevices', head(dynamoItemsProp(userDatasDdb))))
  )
  return devicesForUser
}
