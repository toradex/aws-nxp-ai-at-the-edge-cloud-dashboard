import {
  green,
  red
} from 'chalk'
import {
  reduce,
  compose,
  assocPath,
  propEq,
  append,
  path,
  toPairs,
  prop
} from 'ramda'
import {
  S3,
  CloudFormation
} from 'aws-sdk'
import emoji from 'node-emoji'
import commander from 'commander'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import ora from 'ora'
import commands from 'root/src/aws/util/cfCli/commands'
import badTemplateImport from 'root/src/aws'
import {
  name as packageName,
  awsAdminProfile
} from 'root/appConfig.json'
import {
  camelCase,
  kebabCase,
} from 'root/src/shared/util/stringCase'
import awsConf from 'aws-config'
import findRoot from 'find-root'

import webpackLambdaConf from 'root/src/aws/util/cfCli/webpackLambdaConf'

const getLambdaResourceEntries = ({
  cloudFormationTemplate,
  timeStamp
}) => (
  reduce((result, [resourceKey, resourceObj]) => {
    if (propEq('Type', 'AWS::Lambda::Function', resourceObj)) {
      return append({
        resourceKey,
        resourceZipFileName: `${resourceKey}.js.zip`,
        s3Key: `${resourceKey}_${timeStamp}.zip`,
        entryPath: path(['Properties', 'Code'], resourceObj)
      }, result)
    }
    return result
  }, [], toPairs(prop('Resources', cloudFormationTemplate)))
)

const addZipsToCfTemplate = ({
  lambdaResourceEntries,
  srcCloudFormationTemplate,
  s3DeploymentBucket
}) => reduce(
  (result, {
    resourceKey,
    s3Key
  }) => compose(
    assocPath(
      ['Resources', resourceKey, 'Properties', 'Code'], {
        S3Bucket: s3DeploymentBucket,
        S3Key: s3Key
      }
    ),
    assocPath(
      ['Resources', resourceKey, 'Properties', 'Handler'],
      `${resourceKey}.default`
    )
  )(result),
  srcCloudFormationTemplate,
  lambdaResourceEntries
)



const createConfigObj = ({
  // eslint-disable-next-line no-unused-vars
  name = packageName,
  stage = 'Dev',
  webpackConfig = webpackLambdaConf,
  profile = awsAdminProfile,
  region = 'us-west-2',
  buildDir = '.cloudFormation'
}) => {
  const awsCreds = awsConf({
    region,
    profile
  })
  const timeStamp = Date.now()
  const s3Client = new S3(awsCreds)
  const projectRoot = findRoot(process.cwd())
  const srcCloudFormationTemplate = badTemplateImport
  const lambdaResourceEntries = getLambdaResourceEntries({
    cloudFormationTemplate: srcCloudFormationTemplate,
    timeStamp
  })
  const s3DeploymentBucket = kebabCase(`${name}DeploymentBucket`)

  const templateFileName = `template_${timeStamp}.json`
  const templateUrl = (
    `https://${s3DeploymentBucket}.s3.amazonaws.com/${templateFileName}`
  )

  return {
    templateFileNameLocal: 'template.json',
    templateFileName,
    templateUrl,
    s3DeploymentBucket,
    stackName: camelCase(`${name}${stage}`),
    srcCloudFormationTemplate,
    finalCloudFormationTemplate: addZipsToCfTemplate({
      lambdaResourceEntries,
      srcCloudFormationTemplate,
      s3DeploymentBucket
    }),
    lambdaResourceEntries,
    webpackConfig,
    s3Client,
    cloudFormationClient: new CloudFormation(awsCreds),
    projectRoot,
    buildDir,
    buildPath: `${projectRoot}/${buildDir}`,
    outputPath: `config/cfOutput.js`
  }
}



const noStackError = stackName => (
  `Stack with id ${stackName} does not exist`
)

const getStackStatus = ({
  stackName,
  cloudFormationClient
}) => (
  cloudFormationClient.describeStacks({
    StackName: stackName
  })
  .promise()
  .then(() => 'update')
  .catch((err) => {
    if (err.message === noStackError(stackName)) {
      return 'create'
    }
    return Promise.reject(err.message)
  })
)

const runCommandSteps = (command, config) => reduce(
  (result, {
    title,
    fn
  }) => result.then(() => {
    const spinner = ora(title).start()
    return fn(config).then(() => {
      spinner.succeed()
      // return stepConfig
    }).catch((err) => {
      spinner.fail()
      return Promise.reject(err)
    })
  }),
  Promise.resolve(config),
  commands[command]
)

const runCommand = (command, config) => {
  if (command === 'deploy') {
    const spinner = ora('Getting stack status').start()

    return getStackStatus(config).then((updateOrCreate) => {
      spinner.succeed()
      return runCommandSteps(updateOrCreate, config)
    }).catch((err) => {
      spinner.fail()
      return Promise.reject(err)
    })
  }
  return runCommandSteps(command, config)
}

const boom = emoji.find('collision').emoji
const sad = emoji.find('sob').emoji

const nl = '\n'

commander
  .arguments('<cmd> [template]')
  .option('-n, --name [value]', 'stack name default package.json name')
  .option('-s, --stage [value]', 'deployment stage')
  .option('-w, --webpack-config [value]', 'webpack build options')
  .option('-p, --profile [value]', 'aws credential profile default: default')
  .option('-r, --region [value]', 'aws region default: us-west-2')
  .option('-b, --build-dir [value]', 'src build dir default: .cloudFormation')
  .action((cmd, template, options) => {
    if (!cmd /* || !template */ ) {
      commander.help()
    } else {
      const config = createConfigObj({
        template,
        ...options
      })
      runCommand(cmd, config)
        .then(() => {
          console.info(green(`Done - ${getTimestamp()}`), boom, nl)
        }).catch((err) => {
          console.info(red('Error'), sad, nl, err, nl)
        })
    }
  })
  .parse(process.argv)
