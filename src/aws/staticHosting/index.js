import outputs from 'root/src/aws/staticHosting/outputs'

import {
  ref,
  getAtt,
  join,
} from 'root/src/aws/util/functions'

import {
  CLOUDFRONT_DISTRIBUTION,
  STATIC_BUCKET,
  BUCKET_POLICY,
  CLOUDFRONT_DISTRIBUTION_ORIGIN_ACCESS_IDENTITY
} from 'root/src/aws/staticHosting/resourceIds'

export const staticHostingResources = {
  [CLOUDFRONT_DISTRIBUTION]: {
    Type: 'AWS::CloudFront::Distribution',
    DependsOn: [
      STATIC_BUCKET,
      CLOUDFRONT_DISTRIBUTION_ORIGIN_ACCESS_IDENTITY
    ],
    Properties: {
      DistributionConfig: {
        Enabled: true,
        PriceClass: 'PriceClass_All',
        DefaultCacheBehavior: {
          TargetOriginId: ref(STATIC_BUCKET),
          ViewerProtocolPolicy: 'redirect-to-https',
          MinTTL: 0,
          AllowedMethods: ['HEAD', 'GET'],
          CachedMethods: ['HEAD', 'GET'],
          ForwardedValues: {
            QueryString: true,
            Cookies: {
              Forward: 'none'
            }
          }
        },
        Origins: [{
          DomainName: getAtt(STATIC_BUCKET, 'DomainName'),
          Id: ref(STATIC_BUCKET),
          S3OriginConfig: {
            OriginAccessIdentity: join('', [
              'origin-access-identity/cloudfront/',
              ref(CLOUDFRONT_DISTRIBUTION_ORIGIN_ACCESS_IDENTITY)
            ])
          }
        }],
        DefaultRootObject: 'index.html',
        CustomErrorResponses: [{
            ErrorCode: '404',
            ResponsePagePath: '/index.html',
            ResponseCode: '200',
            ErrorCachingMinTTL: '30'
          },
          {
            ErrorCode: '403',
            ResponsePagePath: '/index.html',
            ResponseCode: '200',
            ErrorCachingMinTTL: '30'
          }
        ],
        HttpVersion: 'http2'
      }
    }
  },
  [STATIC_BUCKET]: {
    Type: 'AWS::S3::Bucket',
    Properties: {
      AccessControl: 'Private'
    }
  },
  [BUCKET_POLICY]: {
    Type: 'AWS::S3::BucketPolicy',
    DependsOn: [CLOUDFRONT_DISTRIBUTION_ORIGIN_ACCESS_IDENTITY],
    Properties: {
      PolicyDocument: {
        Id: 'SiteBucketPolicy',
        Version: '2012-10-17',
        Statement: [{
          Sid: 'PublicReadForGetBucketObjects',
          Effect: 'Allow',
          Principal: {
            CanonicalUser: getAtt(CLOUDFRONT_DISTRIBUTION_ORIGIN_ACCESS_IDENTITY, 'S3CanonicalUserId')
          },
          Action: 's3:GetObject',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:aws:s3:::',
                ref(STATIC_BUCKET),
                '/*'
              ]
            ]
          }
        }]
      },
      Bucket: ref(STATIC_BUCKET)
    }
  },
  [CLOUDFRONT_DISTRIBUTION_ORIGIN_ACCESS_IDENTITY]: {
    Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
    Properties: {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: 'Access identity for serving website'
      }
    }
  }

}

export const staticHostingOutputs = outputs
