import _ from 'lodash';
import { WebhookPayloadPullRequest } from '@octokit/webhooks'
import { WorkflowDetails } from 'services/domains/axosoft/AxosoftModels';
import { GithubService } from 'services/domains/github';
import { AxosoftService } from 'services/domains/axosoft';
import { SlackService } from 'services/domains/slack';

export default class SystemService {
  constructor(
    private _githubService = new GithubService(),
    private _axosoftService = new AxosoftService(),
    private _slackService = new SlackService(),
  ) {
  }

  public async processAxosoftWebhook(payload: WorkflowDetails) {
    const { original, changed } = await this._axosoftService.getWorkflowStepChanges(payload);

    if (payload.user.first_name !== 'Administrator') {
      console.log(`Updating Github label from ${original.name} to ${changed.name}`);
      await this._githubService.updatePullRequestLabels('axosoft-gihub-updater', payload, original, changed);

      console.log('Notifiying Slack');
      await this._slackService.notifyAxosoftChange(payload, original, changed);
    } else {
      console.log(`Messaged received from ${payload.user.first_name} was not processed.`)
    }
  }

  public async processGithubWebhook(payload: WebhookPayloadPullRequest) {
    // TODO: Prevent a cyclic call if the sender is the owner of the repo
    try {
      switch (payload.action) {
        case 'labeled':
          const pr = payload.pull_request;
          const featureNumber = this._githubService.getPullRequestFeatureNumber(pr);

          if (featureNumber) {
            console.log('Updating Axosoft Feature')
            const response = await this._axosoftService.updateFeatureWorkflowStep(featureNumber, pr.labels);
            
            console.log('Notifiying Slack');
            this._slackService.notifyGithubChange(response.data, pr.labels, pr.user);
          } else {
            console.error(`Feature ${pr.title} not found.`)
          }

          break;
        case 'unlabeled':
          console.log('Ignoring unlabeled action.');
          break;
        default:
          console.log('Unhandled action sent by Github', payload.action);
      }

    } catch (error) {
      console.log(error);
    }
  }
}

