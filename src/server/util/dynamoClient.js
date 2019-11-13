import {
  DynamoDB
} from 'aws-sdk'

export const TABLE_NAME = process.env.API_DYNAMO_DB_TABLE

export const dynamoDb = new DynamoDB()

const abstractDCMethod = method => (params) => {
  const client = new DynamoDB.DocumentClient()
  return client[method](params).promise()
}

export const documentClient = {
  batchWrite: (params) => abstractDCMethod('batchWrite')(params),
  put: (params) => abstractDCMethod('put')(params),
  delete: (params) => abstractDCMethod('delete')(params),
  transactWrite: (params) => abstractDCMethod('transactWrite')(params),
  update: (params) => abstractDCMethod('update')(params),
  query: params => abstractDCMethod('query')(params),
  scan: params => abstractDCMethod('scan')(params),
}
