import { WebClient } from '@slack/web-api';
import { WorkflowDetails } from '../axosoft/AxosoftModels';


export default class SlackService {
  constructor(
    private _webClient = new WebClient(process.env.SLACK_ACCESS_TOKEN!.trim())
  ) { }


  public async notify(payload: WorkflowDetails) {
    this._webClient.chat.postMessage({
      channel: '#axosoft-integration',
      text: 'Axosoft Feature Update',
      blocks: [{
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `The has been a change in the workflow step for feature ${payload.original.id}`
        }
      }, {
        type: 'section',
        fields: [{
          type: 'mrkdwn',
          text: `*Description*\n${payload.original.name}`
        },{
          type: 'mrkdwn',
          text: `*Type:*\n${payload.original.item_type}`
        }],
        text: {
          type: 'mrkdwn',
          text: `*Last Update*\n${payload.changed.last_updated_date_time}`
        }
      }]
    })
  }
}