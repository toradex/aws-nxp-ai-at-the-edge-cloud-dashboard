import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { documentClient } from 'root/src/server/util/dynamoClient'

export default async (tableName, { pkBeginning, skBeginning }) => {
  const params = {
    TableName: tableName,
    // ProjectionExpression: '#sk, #pk',
    FilterExpression: 'begins_with(#pk, :pk) and begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#pk': [PARTITION_KEY],
      '#sk': [SORT_KEY]
    },
    ExpressionAttributeValues: {
      ':pk': pkBeginning,
      ':sk': skBeginning
    }
  }

  const scanResults = []
  let items
  do {
    // eslint-disable-next-line no-await-in-loop
    items = await documentClient.scan(params).promise()
    items.Items.forEach(item => scanResults.push(item))
    params.ExclusiveStartKey = items.LastEvaluatedKey
  } while (typeof items.LastEvaluatedKey !== 'undefined')

  return scanResults
}
