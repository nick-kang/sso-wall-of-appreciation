import { github } from '@app/common'
import * as cdk from 'aws-cdk-lib'
import { GitHubActionRole } from 'cdk-pipelines-github'
import { Construct } from 'constructs'

class MyGitHubActionRole extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const provider = new GitHubActionRole(this, 'GitHubActionRole', {
      repos: [`${github.owner}/${github.repo}`],
    })

    new cdk.CfnOutput(this, 'GitHubActionRoleName', {
      value: provider.role.roleName,
    })
  }
}

const app = new cdk.App()
new MyGitHubActionRole(app, 'MyGitHubActionRole', {
  env: { region: 'us-west-2' },
})
