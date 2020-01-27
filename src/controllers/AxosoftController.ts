import { Router, Request, Response } from 'express';
import AxosoftService from '../services/domains/axosoft/AxosoftService';

export default class AxosoftController {
  private service = new AxosoftService();
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
      await this.service.workflowChange(body);
      res.sendStatus(204);
    } catch (e) {
      res.sendStatus(500);
    }
  }
}