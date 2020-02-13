import _ from 'lodash';
import moment from 'moment';
import { WebClient, WebAPICallResult } from '@slack/web-api';
import { WorkflowDetails, WorkflowStep, Workflow } from 'services/domains/axosoft/AxosoftModels';
import { WebhookPayloadPullRequestPullRequestUser } from '@octokit/webhooks';

export default class SlackService {
  constructor(
    private _webClient = new WebClient(process.env.SLACK_ACCESS_TOKEN!.trim())
  ) { }


  public async notifyAxosoftChange(payload: WorkflowDetails, original: WorkflowStep, changed: WorkflowStep): Promise<WebAPICallResult> {
    return this._webClient.chat.postMessage({
      channel: '#axosoft-integration',
      text: 'Axosoft Feature Update',
      blocks: [{
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Workflow Step Change for Feature ${payload.original.id}*\n${payload.original.name}`
        }
      }, {
        type: 'section',
        fields: [{
          type: 'mrkdwn',
          text: `*From Step:*\n${original.name}`
        }, {
          type: 'mrkdwn',
          text: `*To Step:*\n${changed.name}`
        }, {
          type: 'mrkdwn',
          text: `*Last Update:*\n${moment(payload.changed.last_updated_date_time).format('llll')}`
        }, {
          type: 'mrkdwn',
          text: `*User:*\n${payload.user.first_name} ${payload.user.last_name}`
        }]
      }]
    })
  }

  public async notifyGithubChange(payload: Workflow, labels: { name: string }[], user: WebhookPayloadPullRequestPullRequestUser): Promise<WebAPICallResult> {
    return this._webClient.chat.postMessage({
      channel: '#axosoft-integration',
      text: 'Github Feature Update',
      blocks: [{
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Pull Request Label Change for Feature ${payload.id}*\n${payload.name}`
        }
      }, {
        type: 'section',
        fields: [{
          type: 'mrkdwn',
          text: `*Labels:*\n${_(labels).map(x => x.name).join()}`
        }]
      }, {
        type: 'section',
        fields: [{
          type: 'mrkdwn',
          text: `*Last Update:*\n${moment(payload.last_updated_date_time).format('llll')}`
        }, {
          type: 'mrkdwn',
          text: `*User:*\n${user.login}`
        }]
      }]
    })
  }
}
