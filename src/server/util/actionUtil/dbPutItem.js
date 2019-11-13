import { documentClient } from 'root/src/server/util/dynamoClient'

export default (TableName, Item) => documentClient.put({ TableName, Item }).promise()
