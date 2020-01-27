import _ from 'lodash';
import axosoft from 'node-axosoft/promise';
import { WorkflowDetails, WorkflowStep } from './Axosoft';
import GithubService from '../github/GithubService';

export default class AxosoftService {
  axosoftClient: any;
  workflowSteps: WorkflowStep[] = [];
  githubService: GithubService;

  constructor() {
    this.githubService = new GithubService();
    this.axosoftClient = axosoft(process.env.AXOSOFT_BASE_URL?.trim(), {
      access_token: process.env.AXOSOFT_OAUTH_TOKEN?.trim()
    });

    this.axosoftClient.Workflows.get()
      .then((payload: any) => {
        const scrumWorkflow = _.find(payload.data, x => x.name === 'Scrum');
        this.workflowSteps = scrumWorkflow.workflow_steps;
      });
  }

  public async workflowChange(workflow: WorkflowDetails) {
    const workflowPrevStepId = workflow.original.workflow_step.id;
    const workflowNewStepId = workflow.changed.workflow_step.id;

    const workflowPrevStep = _.find(this.workflowSteps, x => x.id === workflowPrevStepId);
    const workflowNewStep = _.find(this.workflowSteps, x => x.id === workflowNewStepId);

    console.log(`Received message after workflow step change from ${workflowPrevStep!.name} to ${workflowNewStep!.name}`);
    this.githubService.updatePullRequestLabels('hack-server', workflowPrevStep!.name, [workflowNewStep!.name]);
  }
}

