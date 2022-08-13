import * as cdk from 'aws-cdk-lib'
import * as pipelines from 'aws-cdk-lib/pipelines'
import { GitHubWorkflow } from 'cdk-pipelines-github'
import { Construct } from 'constructs'

import { CONSTANTS } from './constants'
import { ProductionStage } from './ProductionStage'

export class Pipeline extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      env: { region: CONSTANTS.region, account: CONSTANTS.account },
    })

    const pipeline = new GitHubWorkflow(this, 'CDK', {
      synth: new pipelines.ShellStep('Synth', {
        primaryOutputDirectory: './apps/infrastructure/cdk.out',
        installCommands: [
          'n 16',
          'npm i --location=global pnpm@7',
          'node -v',
          'pnpm -v',
          'pnpm i --frozen-lockfile',
        ],
        commands: [
          'pnpm run build',
          'mkdir apps/web/_next',
          'mv apps/web/out/_next apps/web/_next/_next',
          'pnpm run infrastructure synth',
        ],
      }),
      gitHubActionRoleArn: `arn:aws:iam::${CONSTANTS.account}:role/GitHubActionRole`,
      workflowPath: '../../.github/workflows/deploy.yml',
    })

    pipeline.addStage(
      new ProductionStage(this, 'Prod', {
        env: { region: CONSTANTS.region, account: CONSTANTS.account },
      }),
    )
  }
}
