import map from 'ramda/src/map'
import contains from 'ramda/src/contains'
import UploadStream from 's3-stream-upload'
import fs from 'fs'
import {
  lookup
} from 'mime-types'

const isProdEnv = process.env.STAGE === 'production'
const setContentEncoding = filename => (contains('.br.', filename) ? 'br' : 'gzip')
const uploadFileHof = (s3Client, bucket) => async (
  localPath, fileName
) => {
  let webpackCompressedFilenames = await import('../../../../webpackCompressedFilenames')
  webpackCompressedFilenames = webpackCompressedFilenames.default
  return new Promise(
    (resolve, reject) => {
      fs.createReadStream(localPath).pipe(
        UploadStream(
          s3Client, {
            Bucket: bucket,
            Key: fileName,
            ContentType: lookup(fileName),
            CacheControl: lookup(fileName) !== 'text/html' ? 'max-age=31104000' : 'no-cache',
            ...((isProdEnv && contains(fileName, webpackCompressedFilenames)) ? {
              ContentEncoding: setContentEncoding(fileName)
            } : {})
          }
        )
      ).on('error', (err) => {
        reject(err)
      }).on('finish', () => {
        resolve()
      })
    }
  )
}

export default (s3Client, bucket, fileArr) => {
  const uploadFile = uploadFileHof(s3Client, bucket)
  return Promise.all(
    map(
      ([localPath, s3FileName]) => uploadFile(localPath, s3FileName),
      fileArr
    )
  )
}
