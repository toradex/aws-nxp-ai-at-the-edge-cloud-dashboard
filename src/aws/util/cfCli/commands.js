import {
  reduce,
  propEq,
  append,
  prop,
  propOr,
  map,
  splitEvery,
  concat,
  path,
  contains,
  compose,
  join,
  assoc,
  assocPath,
  find,
} from 'ramda'
import fs from 'fs'
import s3Upload from 'root/src/aws/util/cfCli/s3Upload'
import webpack from 'webpack'
import webpackLambdaConf from 'root/src/aws/util/cfCli/webpackLambdaConf'
import {
  STATIC_BUCKET
} from 'root/src/aws/staticHosting/resourceIds'

import async from 'async'
import {
  lookup
} from 'mime-types'

import readdir from 'recursive-readdir'

const listAllStackResources = (
  cloudFormationClient, stackName, nextToken, lastResources = []
) => cloudFormationClient.listStackResources({
  StackName: stackName,
  NextToken: nextToken
}).promise().then((res) => {
  const resources = propOr([], 'StackResourceSummaries', res)
  const hasNextToken = prop('NextToken', res)
  if (hasNextToken) {
    return listAllStackResources(
      cloudFormationClient, stackName, hasNextToken,
      resources
    )
  }
  return concat(lastResources, resources)
})

const getHostingBucket = (
  cloudFormationClient, stackName
) => (
  listAllStackResources(cloudFormationClient, stackName).then(res => (
    prop(
      'PhysicalResourceId',
      find(propEq('LogicalResourceId', STATIC_BUCKET), res)
    )
  ))
)

// eslint-disable-next-line no-shadow
const clientFiles = path => new Promise((resolve, reject) => {
  fs.readdir(path, (err, fileArr) => {
    if (err) {
      reject(err)
    } else {
      resolve(map(concat(`${path}/`), fileArr))
    }
  })
})

const getFiles = (dirPath) => {
  return fs.existsSync(dirPath) ? readdir(dirPath) : []
}

const uploadAllFolder = async (s3Client, bucket, sourcePath) => {
  const filesToUpload = await getFiles(sourcePath)

  return new Promise((resolve, reject) => {
    async.eachOfLimit(filesToUpload, 10, async.asyncify(async (file) => {
      const Key = file.replace(`${sourcePath}/`, '')
      return new Promise((res, rej) => {
        s3Client.upload({
          Key,
          Bucket: bucket,
          Body: fs.readFileSync(file),
          ContentType: lookup(file),
          CacheControl: lookup(file) !== 'text/html' ? 'max-age=31104000' : 'no-cache',
          ACL: 'public-read'
        }, (err) => {
          if (err) {
            return rej(new Error(err))
          }
          res({
            result: true
          })
        })
      })
    }), (err) => {
      if (err) {
        return reject(new Error(err))
      }
      resolve({
        result: true
      })
    })
  })
}

const uploadStaticsref = (
  s3Client, projectRoot, bucket
) => clientFiles(`${projectRoot}/src/client/dist/spa`).then(
  async () => {
    await uploadAllFolder(s3Client, bucket, `${projectRoot}/src/client/dist/spa`)
    return true
  }
)

const uploadStatics = ({
  cloudFormationClient,
  stackName,
  projectRoot,
  s3Client
}) => getHostingBucket(cloudFormationClient, stackName).then(
  hostingBucket => uploadStaticsref(
    s3Client, projectRoot, hostingBucket
  )
)

const createWebpackConf = (entryPath, resourceKey, buildPath) => (
  compose(
    assoc('entry', ['babel-polyfill', entryPath]),
    assocPath(['output', 'filename'], `${resourceKey}.js`),
    assocPath(['output', 'path'], buildPath)
  )(webpackLambdaConf)
)

const buildFilesHof = buildPath => ({
  entryPath,
  resourceKey
}) => new Promise(
  (resolve, reject) => {
    webpack(
      createWebpackConf(entryPath, resourceKey, buildPath),
      (err, stats) => {
        if (err) {
          reject(err)
        } else if (stats.hasErrors()) {
          const info = stats.toJson()
          reject(info.errors)
        }
        resolve()
      }
    )
  }
)

const webpackLambda = ({
  lambdaResourceEntries,
  buildPath
}) => {
  const buildFiles = buildFilesHof(buildPath)
  return Promise.all(
    map(buildFiles, lambdaResourceEntries)
  )
}

const validateTemplate = ({
  cloudFormationClient,
  templateUrl
}) => cloudFormationClient.validateTemplate({
  TemplateURL: templateUrl
}).promise()

const updateStack = ({
  stackName,
  cloudFormationClient,
  templateUrl
}) => cloudFormationClient.updateStack({
  StackName: stackName,
  Capabilities: ['CAPABILITY_IAM'],
  TemplateURL: templateUrl
}).promise()

const templateLambdaUpload = ({
  s3Client,
  s3DeploymentBucket,
  buildPath,
  lambdaResourceEntries,
  templateFileName,
  templateFileNameLocal
}) => {
  const fileArr = [
    [`${buildPath}/${templateFileNameLocal}`, templateFileName],
    ...map(
      ({
        s3Key,
        resourceZipFileName
      }) => [
        `${buildPath}/${resourceZipFileName}`,
        s3Key
      ],
      lambdaResourceEntries
    )
  ]
  return s3Upload(s3Client, s3DeploymentBucket, fileArr)
}

const formatStackOutput = compose(
  join('\n'),
  map(cfOutputObj => (
    `export const ${prop('OutputKey', cfOutputObj)} = '${prop('OutputValue', cfOutputObj)}'`
  )),
  path(['Stacks', 0, 'Outputs'])
)

const saveOutput = (projectRoot, outputPath, stackOutput) => (
  new Promise(
    (resolve, reject) => {
      fs.writeFile(
        `${projectRoot}/${outputPath}`,
        formatStackOutput(stackOutput),
        (err) => {
          if (err) {
            reject(err)
          }
          resolve()
        }
      )
    }
  )
)

const saveStackOutputs = ({
  cloudFormationClient,
  stackName,
  projectRoot,
  outputPath
}) => (
  cloudFormationClient.describeStacks({
    StackName: stackName
  }).promise().then(
    stackOutput => saveOutput(projectRoot, outputPath, stackOutput)
  )
)

const saveCfTemplate = ({
  finalCloudFormationTemplate,
  buildPath,
  templateFileNameLocal
}) => {
  return new Promise(
    (resolve, reject) => {
      fs.writeFile(
        `${buildPath}/${templateFileNameLocal}`,
        JSON.stringify(finalCloudFormationTemplate),
        (err) => {
          if (err) {
            reject(err)
          }
          resolve()
        }
      )
    }
  )
}

const stackStatusPath = path(['Stacks', 0, 'StackStatus'])

const completeStatus = compose(
  contains('_COMPLETE'),
  stackStatusPath
)
const failedStatus = compose(
  contains('_FAILED'),
  stackStatusPath
)

const getStackProgress = ({
  stackName,
  cloudFormationClient
}) => new Promise(
  (resolve, reject) => {
    const interval = setInterval(() => {
      cloudFormationClient.describeStacks({
        StackName: stackName
      }).promise().then(
        (res) => {
          if (completeStatus(res)) {
            clearInterval(interval)
            resolve()
          } else if (failedStatus(res)) {
            clearInterval(interval)
            reject(prop('StackStatusReason', res))
          }
          // keep checking
        }
      ).catch((err) => {
        clearInterval(interval)
        reject(err.message)
      })
    }, 2000)
  }
)

const getAllBucketNames = (
  cloudFormationClient, stackName
) => (
  listAllStackResources(cloudFormationClient, stackName).then(
    res => reduce((result, resource) => {
      if (propEq('Type', 'AWS::S3::Bucket', resource)) {
        return append(
          result,
          prop('PhysicalResourceId', resource)
        )
      }
      return result
    }, [], res)
  )
)

const getAllItemKeysChunked = (
  s3Client, bucketName, marker, lastItemKeys = []
) => s3Client.listObjects({
  Bucket: bucketName,
  Marker: marker
}).promise().then((res) => {
  const items = propOr([], 'Contents', res)
  const itemKeys = map(item => ({
    Key: prop('Key', item)
  }), items)
  if (prop('IsTruncated', res)) {
    const nextMarker = prop('NextMarker', res)
    return getAllItemKeysChunked(
      s3Client, bucketName, nextMarker, itemKeys
    )
  }
  return splitEvery(1000, concat(lastItemKeys, itemKeys))
})

const deleteObjects = (s3Client, bucketName, itemKeys) => (
  s3Client.deleteObjects({
    Bucket: bucketName,
    Delete: {
      Objects: itemKeys
    }
  }).promise()
)

const deleteAllObjects = (
  s3Client, bucketName, chunkedItemKeys
) => Promise.all(
  map(
    itemKeys => deleteObjects(s3Client, bucketName, itemKeys),
    chunkedItemKeys
  )
)

const deleteBucket = (s3Client, bucketName) => s3Client.deleteBucket({
  Bucket: bucketName
}).promise()

const nukeBucket = (s3Client, bucketName) => getAllItemKeysChunked(
  s3Client, bucketName
).then(chunkedItemKeys => deleteAllObjects(
  s3Client, bucketName, chunkedItemKeys
).then(() => deleteBucket(s3Client, bucketName)))

const emptyDeleteBuckets = ({
  cloudFormationClient,
  s3Client,
  s3DeploymentBucket,
  stackName
}) => getAllBucketNames(cloudFormationClient, stackName).then(
  (resourceBucketNames) => {
    const allS3BucketNames = append(s3DeploymentBucket, resourceBucketNames)
    return Promise.all(
      map(
        bucketName => nukeBucket(s3Client, bucketName),
        allS3BucketNames
      )
    )
  }
)

const createNewStack = ({
  stackName,
  cloudFormationClient,
  templateUrl
}) => cloudFormationClient.createStack({
  StackName: stackName,
  Capabilities: ['CAPABILITY_IAM'],
  TemplateURL: templateUrl
}).promise()

const createS3DeploymentBucket = ({
  s3Client,
  s3DeploymentBucket
}) => (
  s3Client.createBucket({
    Bucket: s3DeploymentBucket
  }).promise()
)

const deleteStack = ({
  stackName,
  cloudFormationClient
}) => cloudFormationClient.deleteStack({
  StackName: stackName
}).promise()

const afterCreateOrUpdate = [{
    title: 'Waiting for stack to complete',
    fn: getStackProgress
  },
  {
    title: 'Saving stack output',
    fn: saveStackOutputs
  },
  {
    title: 'Uploading statics',
    fn: uploadStatics
  }
]
const bundleLambda = [{
    title: 'Bundling lambda functions',
    fn: webpackLambda
  },
  {
    title: 'Updating and saving template',
    fn: saveCfTemplate
  },

]

const createUpdateCommon = [{
    title: 'Bundling lambda functions',
    fn: webpackLambda
  },
  {
    title: 'Updating and saving template',
    fn: saveCfTemplate
  },
  {
    title: 'Uploading files to s3',
    fn: templateLambdaUpload
  },
  {
    title: 'Validating template',
    fn: validateTemplate
  }
]

const create = [{
    title: 'Creating s3 bucket',
    fn: createS3DeploymentBucket
  },
  ...createUpdateCommon,
  {
    title: 'Creating stack',
    fn: createNewStack
  },
  ...afterCreateOrUpdate
]

const update = [
  ...createUpdateCommon,
  {
    title: 'Updating stack',
    fn: updateStack
  },
  ...afterCreateOrUpdate
]

const remove = [{
    title: 'Emptying s3 buckets',
    fn: emptyDeleteBuckets
  },
  {
    title: 'Deleting stack',
    fn: deleteStack
  },
  {
    title: 'Delete processing...',
    fn: getStackProgress
  }
]

const outputs = [{
  title: 'Saving stack output',
  fn: saveStackOutputs
}]

export default {
  create,
  update,
  remove,
  outputs,
  bundleLambda
}
