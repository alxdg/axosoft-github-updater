import { WorkflowDetails, WorkflowStep } from 'services/domains/axosoft/AxosoftModels';
import { GithubService } from 'services/domains/github';
import { AxosoftService } from 'services/domains/axosoft';
import { SlackService } from 'services/domains/slack';

export default class SystemService {
  private workflowSteps: WorkflowStep[] = [];

  constructor(
    private _githubService = new GithubService(),
    private _axosoftService = new AxosoftService(),
    private _slackService = new SlackService(),
  ) {
    this._axosoftService.getWorkflowSteps('Scrum')
      .then((data) => {
        this.workflowSteps = data;
      });
  }

  public async updateGithubLabel(payload: WorkflowDetails) {
    const { original, changed } = await this._axosoftService.getWorkflowStepChanges(payload, this.workflowSteps);

    console.log(`Updating Github label from ${original!.name} to ${changed!.name}`);
    this._githubService.updatePullRequestLabels('axosoft-gihub-updater', payload, original, changed);

    console.log('Notifiying Slack');
    this._slackService.notify(payload, original, changed);
  }

  public async updateAxosoftWorkflowStep(payload: any) {
    console.log('Received message from Github');
    console.log(payload);
  }
}

