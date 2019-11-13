import outputs from 'root/src/aws/api/outputs'
import {
  getAtt,
  ref,
  join,
} from 'root/src/aws/util/functions'
import {
  PARTITION_KEY,
  SORT_KEY
} from 'root/src/shared/constants/apiDynamoIndexes'

import {
  API_LAMBDA_FUNCTION,
  API_LAMBDA_EXECUTION_ROLE,
  API_DYNAMO_DB_TABLE
} from 'root/src/aws/api/resourceIds'

const commonPolicies = [{
  Effect: 'Allow',
  Action: [
    'lambda:InvokeFunction'
  ],

  Resource: [
    getAtt(API_LAMBDA_FUNCTION, 'Arn')
  ]
}]

export const DependsOn = [
  API_LAMBDA_EXECUTION_ROLE,
  API_DYNAMO_DB_TABLE
]

export const Environment = {
  Variables: {
    API_DYNAMO_DB_TABLE: ref(API_DYNAMO_DB_TABLE),
    STAGE: process.env.STAGE || 'dev',
  }
}

const fnBuildPath = fnName => `./src/server/${fnName}/index.js`



export const apiResources = {
  [API_LAMBDA_FUNCTION]: {
    Type: 'AWS::Lambda::Function',
    DependsOn,
    Properties: {
      Code: fnBuildPath('api'),
      Environment,
      Role: getAtt(API_LAMBDA_EXECUTION_ROLE, 'Arn'),
      MemorySize: 1024,
      Runtime: 'nodejs8.10',
      Timeout: 10
    }
  },
  [API_LAMBDA_EXECUTION_ROLE]: {
    Type: 'AWS::IAM::Role',
    DependsOn: [
      API_DYNAMO_DB_TABLE
    ],
    Properties: {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Principal: {
            Service: ['lambda.amazonaws.com']
          },
          Action: ['sts:AssumeRole']
        }]
      },
      Policies: [{
        PolicyName: 'root',
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [{
              Effect: 'Allow',
              Action: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
                'logs:DescribeLogStreams'
              ],
              Resource: [
                'arn:aws:logs:*:*:*'
              ]
            },
            {
              Effect: 'Allow',
              Action: [
                'ses:SendEmail'
              ],
              Resource: join(
                ':',
                [
                  'arn:aws:ses',
                  ref('AWS::Region'),
                  ref('AWS::AccountId'),
                  '*'
                ]
              )
            },
            {
              Effect: 'Allow',
              Action: [
                'lambda:AddPermission',
                'lambda:RemovePermission'
              ],
              Resource: join(
                ':',
                [
                  'arn:aws:lambda:us-west-2',
                  ref('AWS::AccountId'),
                  '*:*'
                ]
              )
            },
            {
              Effect: 'Allow',
              Action: 'secretsmanager:GetSecretValue',
              Resource: 'arn:aws:secretsmanager:*:*:*'
            },
            {
              Effect: 'Allow',
              Action: [
                'cognito-idp:AdminGetUser',
                'cognito-idp:ListUsers'
              ],
              Resource: [
                'arn:aws:cognito-idp:*:*:*'
              ]
            },
            {
              Effect: 'Allow',
              Action: [
                'dynamodb:DescribeTable',
                'dynamodb:Query',
                'dynamodb:Scan',
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem',
                'dynamodb:BatchWriteItem',
                'dynamodb:BatchGetItem',
                'dynamodb:BatchGetItem'
              ],
              Resource: [
                join('', [getAtt(API_DYNAMO_DB_TABLE, 'Arn'), '*'])
              ]
            },
            {
              Sid: 'CloudWatchEventsFullAccess',
              Effect: 'Allow',
              Action: ['events:*'],
              Resource: '*'
            },
            {
              Effect: 'Allow',
              Action: [
                'iot:Publish'
              ],
              Resource: [
                '*'
              ]
            }

          ]
        }
      }]
    }
  },
  [API_DYNAMO_DB_TABLE]: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      AttributeDefinitions: [{
          AttributeName: PARTITION_KEY,
          AttributeType: 'S'
        },
        {
          AttributeName: SORT_KEY,
          AttributeType: 'S'
        }
      ],
      KeySchema: [{
          AttributeName: PARTITION_KEY,
          KeyType: 'HASH'
        },
        {
          AttributeName: SORT_KEY,
          KeyType: 'RANGE'
        }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    }
  }
}

export const apiOutputs = outputs

export const apiAuthPolicies = commonPolicies
export const apiUnauthPolicies = commonPolicies
