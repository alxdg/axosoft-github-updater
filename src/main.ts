require('dotenv').config();
import express, { Router, Request, Response } from 'express';
import { AxosoftController } from './controllers';
import GithubService from './services/domains/github/GithubService';

const app = express()
const router = Router();

app.use(express.json());

app.get('/', function (req, res) {
  console.log('Got a message');
  res.send('Hello World')
});

app.use('/api', new AxosoftController().router);

app.listen(process.env.PORT, () => console.log('Listening on port', process.env.PORT));
