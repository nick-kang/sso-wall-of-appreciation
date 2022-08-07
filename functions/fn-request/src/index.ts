import {
  CreateVendor,
  CreateVendorResponse,
  github,
  paramNames,
} from '@app/common'
import { GetParametersCommand, SSMClient } from '@aws-sdk/client-ssm'
import { Octokit } from '@octokit/rest'
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { verify } from 'hcaptcha'
import snakecaseKeys from 'snakecase-keys'
import YAML from 'yaml'
import { z } from 'zod'

const EnvSchema = z.object({
  HCAPTCHA_SECRET: z.string(),
  GH_ACCESS_TOKEN: z.string(),
})

const ssmClient = new SSMClient({ region: 'us-west-2' })

let hcaptchaSecret: string
let gh: Octokit

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (hcaptchaSecret == null || gh == null) {
    const { Parameters: parameters } = await ssmClient.send(
      new GetParametersCommand({
        Names: [paramNames.ghAccessToken, paramNames.hcaptchaSecret],
      }),
    )

    const GH_ACCESS_TOKEN = parameters?.[0]?.Value
    const HCAPTCHA_SECRET = parameters?.[1]?.Value

    const env = EnvSchema.parse({ HCAPTCHA_SECRET, GH_ACCESS_TOKEN })

    hcaptchaSecret = env.HCAPTCHA_SECRET
    gh = new Octokit({ auth: env.GH_ACCESS_TOKEN })
  }

  if (event.body == null) {
    return {
      statusCode: 400,
      body: 'Missing body payload',
    }
  }

  const body = CreateVendor.safeParse(JSON.parse(event.body))

  if (!body.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid body',
        error: body.error,
      }),
    }
  }

  const { captchaToken, ...vendor } = body.data

  const captchaVerification = await verify(hcaptchaSecret, captchaToken)

  if (!captchaVerification.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Failed captcha' }),
    }
  }

  const issue = await gh.issues.create({
    owner: github.owner,
    repo: github.repo,
    title: vendor.name,
    body: YAML.stringify(snakecaseKeys(vendor)),
  })

  const response: CreateVendorResponse = {
    url: issue.url,
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  }
}
