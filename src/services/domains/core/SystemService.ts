import { GithubService } from '../github';
import { AxosoftService } from '../axosoft';
import { WorkflowDetails } from '../axosoft/AxosoftModels';
import { SlackService } from '../slack';

export default class SystemService {
  constructor(
    private _githubService = new GithubService(),
    private _axosoftService = new AxosoftService(),
    private _slackService = new SlackService(),
  ) {
  }

  public async updateGithubLabel(payload: WorkflowDetails) {
    const workflowSteps = await this._axosoftService.getWorkflowSteps('Scrum');
    const { original, change } = await this._axosoftService.getWorkflowStepChanges(payload, workflowSteps);

    console.log(`Updating Github label from ${original!.name} to ${change!.name}`);
    this._githubService.updatePullRequestLabels('hack-server', original!.name, [change!.name]);

    console.log('Notifiying Slack');
    this._slackService.notify(payload);
  }
}

