import { Router, Request, Response } from 'express';

// Local Deps
import { SystemService } from 'services/domains/core';

export default class GithubController {
  private service = new SystemService();
  public router = Router();
  public path = '/github';

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(`${this.path}/webhook`, this.webhook.bind(this));
  }

  private async webhook({ body }: Request, res: Response) {
    try {
      console.log('Received message from github.')
      await this.service.processGithubWebhook(body);
      res.sendStatus(204);
    } catch (e) {
      res.sendStatus(500);
    }
  }
}