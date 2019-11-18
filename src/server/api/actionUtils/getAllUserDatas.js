import {
  TABLE_NAME,
  documentClient
} from 'root/src/server/util/dynamoClient'
import {
  PARTITION_KEY,
} from 'root/src/shared/constants/apiDynamoIndexes'
import {
  dynamoItemsProp,
} from 'root/src/shared/descriptions/apiLenses'

export default async () => {
  const userDatas = await documentClient.query({
    TableName: TABLE_NAME,
    KeyConditionExpression: `${PARTITION_KEY} = :pk`,
    ExpressionAttributeValues: {
      ':pk': 'user-data'
    },
  })


  return dynamoItemsProp(userDatas)
}
