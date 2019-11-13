import { S3 } from 'aws-sdk'

export default new S3({ signatureVersion: 'v4' })
