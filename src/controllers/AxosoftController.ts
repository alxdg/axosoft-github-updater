import { Router, Request, Response } from 'express';
import { SystemService } from '../services/domains/core';

export default class AxosoftController {
  private service = new SystemService();
  public router = Router();
  public path = '/axosoft';

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(`${this.path}/workflow`, this.workflowChange.bind(this));
  }


  private async workflowChange({ body }: Request, res: Response) {
    try {
      console.log('Message received from Axosoft');
      
      await this.service.processAxosoftWebhook(body);
      res.sendStatus(204);
    } catch (e) {
      res.sendStatus(500);
    }
  }
}
