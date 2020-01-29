import _ from 'lodash';
import Octokit from '@octokit/rest';

export default class GitHub {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN?.trim()
    });
  }

  public async updatePullRequestLabels(repo: string, prevLabel: string, newLabels: string[]) {
    const owner = process.env.GITHUB_REPO_OWNER!.trim();
    const { data } = await this.octokit.pulls.list({ owner, repo });
    try {
      const pullRequest = _.find(data, x => x.title.toLowerCase().indexOf(`feature 1`) > -1);
      if (pullRequest) {
        await this.octokit.issues.removeLabel({
          issue_number: pullRequest.number,
          name: prevLabel,
          owner,
          repo
        });

        await this.octokit.issues.addLabels({
          issue_number: pullRequest.number,
          labels: newLabels,
          owner,
          repo
        });
      } else {
        console.log('Pull request has not been created');
      }
    } catch (e) {
      console.error(e);
    }
  }

  public async workflowStepChange() {
    // this.axosoft.updateFeature();
  }
}