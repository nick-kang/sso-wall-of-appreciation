import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'

import { Application } from './Application'

export class ProductionStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: cdk.StageProps) {
    super(scope, id, props)
    new Application(this, 'Application', props)
  }
}
