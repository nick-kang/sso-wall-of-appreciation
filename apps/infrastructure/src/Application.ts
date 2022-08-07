import { apiRoutes, hostname, paramNames } from '@app/common'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha'
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import * as cdk from 'aws-cdk-lib'
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager'
import * as cf from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as statements from 'cdk-iam-floyd'
import { Construct } from 'constructs'

import { CONSTANTS } from './constants'

export class Application extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props)

    /*********** DNS ***********/
    const hostedZone = new route53.PublicHostedZone(this, 'PublicHostedZone', {
      zoneName: hostname,
    })

    /*********** ACM ***********/

    const certificateUSEast1 = new certificatemanager.DnsValidatedCertificate(
      this,
      'CertificateUSEast1',
      {
        domainName: `*.${hostname}`,
        hostedZone,
        region: 'us-east-1',
        subjectAlternativeNames: [hostname],
        validation:
          certificatemanager.CertificateValidation.fromDns(hostedZone),
      },
    )

    /********** API GW **********/

    const httpApi = new apigwv2.HttpApi(this, 'HttpApi')
    const requestsFn = new nodejs.NodejsFunction(this, 'RequestsFunction', {
      entry: '../../functions/fn-request/src/index.ts',
      architecture: lambda.Architecture.ARM_64,
      timeout: cdk.Duration.seconds(5),
    })

    requestsFn.addToRolePolicy(
      new statements.Ssm()
        .toGetParameters()
        .on(
          `arn:aws:ssm:${CONSTANTS.region}:${CONSTANTS.account}:parameter${paramNames.ghAccessToken}`,
          `arn:aws:ssm:${CONSTANTS.region}:${CONSTANTS.account}:parameter${paramNames.hcaptchaSecret}`,
        ),
    )

    httpApi.addRoutes({
      path: apiRoutes.requests,
      methods: [apigwv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration(
        'RequestsIntegration',
        requestsFn,
      ),
    })

    /*********** CDN ***********/

    const htmlFiles = new s3.Bucket(this, 'HtmlFilesBucket', {
      enforceSSL: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    })
    new s3deploy.BucketDeployment(this, 'HtmlFilesDeployment', {
      sources: [s3deploy.Source.asset('../web/out')],
      destinationBucket: htmlFiles,
      cacheControl: [
        s3deploy.CacheControl.fromString('public, max-age=0, must-revalidate'),
      ],
    })

    const staticFiles = new s3.Bucket(this, 'StaticFilesBucket', {
      enforceSSL: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    })
    new s3deploy.BucketDeployment(this, 'StaticFilesDeployment', {
      sources: [s3deploy.Source.asset('../web/_next')],
      destinationBucket: staticFiles,
      cacheControl: [
        s3deploy.CacheControl.fromString('public, max-age=31536000, immutable'),
      ],
    })

    // https://github.com/awslabs/aws-solutions-constructs/blob/d0474e6841376db224fc82ce55eb090d1634b4d9/source/patterns/%40aws-solutions-constructs/core/lib/cloudfront-distribution-defaults.ts#L22-L41
    const apiEndPointUrlWithoutProtocol = cdk.Fn.select(
      1,
      cdk.Fn.split('://', httpApi.url!),
    )
    const apiEndPointDomainName = cdk.Fn.select(
      0,
      cdk.Fn.split('/', apiEndPointUrlWithoutProtocol),
    )

    const distribution = new cf.Distribution(this, 'RootDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(htmlFiles),
        allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cf.CachePolicy.CACHING_DISABLED,
        responseHeadersPolicy: cf.ResponseHeadersPolicy.SECURITY_HEADERS,
        originRequestPolicy: cf.OriginRequestPolicy.CORS_S3_ORIGIN,
      },
      additionalBehaviors: {
        '/_next/*': {
          origin: new origins.S3Origin(staticFiles),
          allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cf.CachePolicy.CACHING_OPTIMIZED,
          responseHeadersPolicy: cf.ResponseHeadersPolicy.SECURITY_HEADERS,
          originRequestPolicy: cf.OriginRequestPolicy.CORS_S3_ORIGIN,
        },
        '/api/*': {
          origin: new origins.HttpOrigin(apiEndPointDomainName),
          allowedMethods: cf.AllowedMethods.ALLOW_ALL,
          viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cf.CachePolicy.CACHING_DISABLED,
          responseHeadersPolicy: cf.ResponseHeadersPolicy.SECURITY_HEADERS,
          // https://stackoverflow.com/a/66324904/8400466
          originRequestPolicy:
            cf.OriginRequestPolicy.USER_AGENT_REFERER_HEADERS,
        },
      },
      defaultRootObject: 'index.html',
      priceClass: cf.PriceClass.PRICE_CLASS_100,
      domainNames: [hostname],
      certificate: certificateUSEast1,
    })

    new route53.ARecord(this, 'ARecordRoot', {
      recordName: undefined,
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution),
      ),
    })
  }
}
