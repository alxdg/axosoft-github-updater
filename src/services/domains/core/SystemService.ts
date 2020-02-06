import _ from 'lodash';
import { WebhookPayloadPullRequest } from '@octokit/webhooks'
import { WorkflowDetails, WorkflowStep } from 'services/domains/axosoft/AxosoftModels';
import { GithubService } from 'services/domains/github';
import { AxosoftService } from 'services/domains/axosoft';
import { SlackService } from 'services/domains/slack';

export default class SystemService {
  private _workflowSteps: WorkflowStep[] = [];

  constructor(
    private _githubService = new GithubService(),
    private _axosoftService = new AxosoftService(),
    private _slackService = new SlackService(),
  ) {
    this._axosoftService.getWorkflowSteps('Scrum')
      .then((data) => {
        this._workflowSteps = data;
      });
  }

  public async processAxosoftWebhook(payload: WorkflowDetails) {
    const { original, changed } = await this._axosoftService.getWorkflowStepChanges(payload, this._workflowSteps);


    if (payload.user.first_name !== 'Administrtor') {
      console.log(`Updating Github label from ${original.name} to ${changed.name}`);
      await this._githubService.updatePullRequestLabels('axosoft-gihub-updater', payload, original, changed);
    } else {
      console.log(`Messaged received from ${payload.user.first_name} was not processed.`)
    }

    console.log('Notifiying Slack');
    await this._slackService.notify(payload, original, changed);
  }

  public async processGithubWebhook(payload: WebhookPayloadPullRequest) {
    // TODO: Prevent a cyclic call if the sender is the owner of the repo
    try {
      switch (payload.action) {
        case 'labeled':
        case 'unlabeled':
          const pr = payload.pull_request;
          const featureNumber = this._githubService.getPullRequestNumber(pr);
          const labels = _.filter(this._workflowSteps, x => !!_.find(pr.labels, y => x.name === y.name));

          if (labels && featureNumber) {
            await this._axosoftService.updateFeatureLabels(featureNumber, labels);
          }
          break;
        default:
          console.log('Unhandled action sent by Github', payload.action);
      }

    } catch (error) {
      console.log(error);
    }
  }
}

