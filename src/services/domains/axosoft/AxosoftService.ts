import _ from 'lodash';
import axosoft from 'node-axosoft/promise';
import { WorkflowDetails, WorkflowStep } from './AxosoftModels';

export default class AxosoftService {
  private _client: any;
  private _workflowSteps: WorkflowStep[] = [];

  constructor() {
    this._client = axosoft(process.env.AXOSOFT_BASE_URL?.trim(), {
      access_token: process.env.AXOSOFT_OAUTH_TOKEN?.trim()
    });

    // Get workflow steps and save them locally
    this.getWorkflowSteps('Scrum')
      .then((data: WorkflowStep[]) => {
        this._workflowSteps = data;
      });
  }

  public get workflowSteps() { return this._workflowSteps }

  private async getWorkflowSteps(workflowName: string): Promise<WorkflowStep[]> {
    const { data } = await this._client.Workflows.get();
    const workflow = _.find(data, x => x.name === workflowName);
    return workflow.workflow_steps;
  }

  public async getWorkflowStepChanges(payload: WorkflowDetails): Promise<{ original: WorkflowStep, changed: WorkflowStep }> {
    const workflowPrevStepId = payload.original.workflow_step.id;
    const workflowNewStepId = payload.changed.workflow_step.id;

    const original = _.find(this._workflowSteps, x => x.id === workflowPrevStepId)!;
    const changed = _.find(this._workflowSteps, x => x.id === workflowNewStepId)!;

    return { original, changed }
  }

  public async updateFeatureWorkflowStep(featureNumber: string, labels: { name: string }[]) {
    const wfsId = this.mapWorkflowStepFromGithubLabels(labels);

    return await this._client.Features.update(featureNumber, {
      item: { workflow_step: { id: wfsId } }
    });
  }

  private mapWorkflowStepFromGithubLabels = (labels: { name: string }[]): number | undefined => {
    if (this.checkPullRequestLabels(labels, ['Assigned'])) {
      return this.getWfsId('Assigned');
    } else if (this.checkPullRequestLabels(labels, ['Development'])) {
      return this.getWfsId('Development');
    } else if (this.checkPullRequestLabels(labels, ['In Test', 'Ready For QA', 'QA Currently Reviewing'])) {
      return this.getWfsId('Testing');
    } else if (this.checkPullRequestLabels(labels, ['QA Approved'])) {
      return this.getWfsId('QA Approved / PM Review');
    } else if (this.checkPullRequestLabels(labels, ['PM Approved'])) {
      return this.getWfsId('PM Approved');
    }

    return 0;
  }

  private checkPullRequestLabels(prLabels: { name: string }[], githubLabels: string[]) {
    const prLabelNames = _.map(prLabels, x => x.name);

    return _.intersection(prLabelNames, githubLabels).length > 0;
  }

  private getWfsId(wfsLabel: string): number | undefined {
    const wfsId = _(this._workflowSteps).find((x: WorkflowStep) => x.name === wfsLabel)?.id;
    return wfsId;
  }
}

