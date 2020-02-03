import _ from 'lodash';
import axosoft from 'node-axosoft/promise';
import { WorkflowDetails, WorkflowStep } from './AxosoftModels';

export default class AxosoftService {
  private axosoftClient: any;

  constructor() {
    this.axosoftClient = axosoft(process.env.AXOSOFT_BASE_URL?.trim(), {
      access_token: process.env.AXOSOFT_OAUTH_TOKEN?.trim()
    });
  }

  public async getWorkflowSteps(workflowName: string): Promise<WorkflowStep[]> {
    const { data } = await this.axosoftClient.Workflows.get();
    const workflow = _.find(data, x => x.name === workflowName);
    return workflow.workflow_steps;
  }

  public async getWorkflowStepChanges(payload: WorkflowDetails, workflowSteps: WorkflowStep[]): Promise<{ original: WorkflowStep, changed: WorkflowStep }> {
    const workflowPrevStepId = payload.original.workflow_step.id;
    const workflowNewStepId = payload.changed.workflow_step.id;

    const original = _.find(workflowSteps, x => x.id === workflowPrevStepId)!;
    const changed = _.find(workflowSteps, x => x.id === workflowNewStepId)!;

    return { original, changed }
  }

  public async updateFeature() {
    throw new Error('Method not implemented.');
  }
}

