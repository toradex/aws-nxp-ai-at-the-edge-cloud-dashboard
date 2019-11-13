import {
  ref,
  getAtt,
} from 'root/src/aws/util/functions'

import {
  CLOUDFRONT_DISTRIBUTION
} from 'root/src/aws/staticHosting/resourceIds'

import {
  CLOUDFRONT_DISTRIBUTION_ARN,
  CLOUDFRONT_DISTRIBUTION_DOMAINNAME
} from 'root/src/aws/staticHosting/outputIds'

export default {
  [CLOUDFRONT_DISTRIBUTION_ARN]: {
    Description: 'Cloudfront distribution',
    Value: ref(CLOUDFRONT_DISTRIBUTION)
  },
  [CLOUDFRONT_DISTRIBUTION_DOMAINNAME]: {
    Description: 'Api dynamodb table name',
    Value: getAtt(CLOUDFRONT_DISTRIBUTION, 'DomainName')
  }
}
