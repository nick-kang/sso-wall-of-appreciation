import * as cdk from 'aws-cdk-lib'

import { Pipeline } from './Pipeline'

const app = new cdk.App()
new Pipeline(app, 'Pipeline')
