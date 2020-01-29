import { Router, Request, Response } from 'express';
import { GithubService } from '../services/domains/github';

export default class GithubController {
  private service = new GithubService();
  public router = Router();
  public path = '/github';

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(`${this.path}/webhook`, this.workflowChange.bind(this));
  }


  private async workflowChange({ body }: Request, res: Response) {
    try {
      await this.service.workflowStepChange();
      res.sendStatus(204);
    } catch (e) {
      res.sendStatus(500);
    }
  }
}