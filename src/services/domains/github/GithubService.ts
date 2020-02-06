import _ from 'lodash';
import { Octokit } from '@octokit/rest';
import { WorkflowStep, WorkflowDetails } from 'services/domains/axosoft/AxosoftModels';
import { WebhookPayloadPullRequestPullRequest } from '@octokit/webhooks';

export default class GitHub {
  private _octokit: Octokit;

  constructor() {
    this._octokit = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN
    });
  }

  public async updatePullRequestLabels(repo: string, workflowDetail: WorkflowDetails, original: WorkflowStep, changed: WorkflowStep) {
    const owner = process.env.GITHUB_REPO_OWNER!;
    const { data } = await this._octokit.pulls.list({ owner, repo });
    try {
      const pullRequest = _.find(data, x => parseInt(x.title.match(/\d+/)![0], 10) === workflowDetail.original.id);
      if (pullRequest) {

        // Remove the label if it exists in the PR
        if (_.find(pullRequest.labels, x => x.name === original.name)) {
          console.log(`Removing label ${original.name} to PR: ${workflowDetail.original.name}`);
          await this._octokit.issues.removeLabel({
            issue_number: pullRequest.number,
            name: original.name,
            owner,
            repo
          });
        } else {
          console.log(`The label: ${original.name} for PR is not set.`);
        }

        // Add the label to the PR if it does not exist
        if (!_.find(pullRequest.labels, x => x.name === changed.name)) {
          console.log(`Adding label ${changed.name} to PR: ${workflowDetail.original.name}`);
          await this._octokit.issues.addLabels({
            issue_number: pullRequest.number,
            labels: [changed.name],
            owner,
            repo
          });
        } else {
          console.log(`The label: ${changed.name} for the PR is already set.`);
        }
      } else {
        console.log('Pull request has not been created');
      }
    } catch (e) {
      throw e;
    }
  }

  public getPullRequestNumber(pr: WebhookPayloadPullRequestPullRequest): string | null {
    const featureNumberRegex = /\d+/;
    return pr && featureNumberRegex.test(pr.title) ? pr.title.match(featureNumberRegex)![0] : null;
  }
}
