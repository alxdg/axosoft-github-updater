require('dotenv').config();
import http, { IncomingMessage } from 'http';
import createHandler from 'github-webhook-handler';
import WebhooksApi, { WebhookPayloadPullRequest, WebhookPayloadLabel } from '@octokit/webhooks';

const webhooks = new WebhooksApi({
  secret: process.env.GITHUB_SECRET!,
  path: '/webhook'
});

webhooks.on("pull_request", ({ id, name, payload }) => {
  console.log(name, "event received");
});

webhooks.on("error", (error: ) => {
  console.log(`Error occured in "${error.event.name} handler: ${error.stack}"`);
});

http.createServer(webhooks.middleware)
  .listen(process.env.PORT);

console.log('Listening on port', process.env.PORT)