import {
  getAtt
} from 'root/src/aws/util/functions'

import {
  API_LAMBDA_FUNCTION,
  API_DYNAMO_DB_TABLE
} from 'root/src/aws/api/resourceIds'

const API_FUNCTION_ARN = 'apiFunctionArn'
const API_DYNAMO_TABLE_NAME = 'apiDynamoTableName'


export default {
  [API_FUNCTION_ARN]: {
    Description: 'Api Lambd fn arn',
    Value: getAtt(API_LAMBDA_FUNCTION, 'Arn')
  },
  [API_DYNAMO_TABLE_NAME]: {
    Description: 'Api dynamodb table name',
    Value: getAtt(API_DYNAMO_DB_TABLE, 'Arn')
  }
}
