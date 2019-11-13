import {
  camelCase
} from 'root/src/shared/util/stringCase'
import packageJson from 'root/appConfig.json'


export const getAtt = (obj, key) => ({
  'Fn::GetAtt': [obj, key]
})

export const join = (separator, stringArray) => ({
  'Fn::Join': [
    separator,
    stringArray
  ]
})

export const ref = resourceId => ({
  Ref: resourceId
})

// eslint-disable-next-line import/no-mutable-exports
let stage = process.env.STAGE || 'dev'
if (stage === 'staging') {
  stage = 'dev'
}

export const resourcePrefix = camelCase(`${packageJson.name} ${stage}`)
