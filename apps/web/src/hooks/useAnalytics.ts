import { AwsRum, AwsRumConfig } from 'aws-rum-web'
import { useMemo } from 'react'

const config: AwsRumConfig = {
  sessionSampleRate: 1,
  guestRoleArn:
    'arn:aws:iam::337757081551:role/Prod-Application-IdentityPoolRole2127AB44-1D13YW9JCIGT7',
  identityPoolId: 'us-west-2:d651afcb-f92d-4f43-95db-b810687de2dd',
  endpoint: 'https://dataplane.rum.us-west-2.amazonaws.com',
  telemetries: ['errors', 'performance', 'http'],
  allowCookies: true,
  enableXRay: true,
}

const APPLICATION_ID: string = 'f4b30030-4291-42e8-997b-cc00c6a2d776'
const APPLICATION_VERSION: string = '1.0.0'
const APPLICATION_REGION: string = 'us-west-2'

let awsRum: AwsRum | undefined

export function useAnalytics(): AwsRum | undefined {
  const rum = useMemo((): AwsRum | undefined => {
    if (awsRum == null && typeof window !== 'undefined') {
      awsRum = new AwsRum(
        APPLICATION_ID,
        APPLICATION_VERSION,
        APPLICATION_REGION,
        config,
      )
    }

    return awsRum
  }, [])

  return rum
}
