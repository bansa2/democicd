import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import {CodePipeline, CodePipelineSource, ShellStep}from 'aws-cdk-lib/pipelines';
import { PipelineAppStage } from './demoawspipeline-app-stack';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';


export class DemoawspipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

  const democicdpipeline = new CodePipeline(this, 'demopipeline', {
    synth: new ShellStep('Synth', {
      input: CodePipelineSource.gitHub('bansa2/democicd', 'main'),
      commands: [
        'npm ci',
        'npm run build',
        'npx cdk synth',
      ],
    }),
  });
  const testingStage = democicdpipeline.addStage(new PipelineAppStage(this, 'test', {
    env: { account: '108022054378', region: 'ap-south-1' }
  }));

  testingStage.addPost(new ManualApprovalStep('approval'));

  const prodStage = democicdpipeline.addStage(new PipelineAppStage(this, 'prod', {
    env: { account: '108022054378', region: 'ap-south-1' }
  }));

  }
}
