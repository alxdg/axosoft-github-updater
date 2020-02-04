import moment from 'moment';
import { WebClient } from '@slack/web-api';
import { WorkflowDetails, WorkflowStep } from '../axosoft/AxosoftModels';

export default class SlackService {
  constructor(
    private _webClient = new WebClient(process.env.SLACK_ACCESS_TOKEN!.trim())
  ) { }


  public async notify(payload: WorkflowDetails, original: WorkflowStep, changed: WorkflowStep) {
    this._webClient.chat.postMessage({
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
}