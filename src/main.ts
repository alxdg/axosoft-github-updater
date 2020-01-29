require('dotenv').config();
import _ from 'lodash';
import express, { Router } from 'express';
import * as controllers from './controllers';

console.log()

const app = express()
const router = Router();

app.use(express.json());

app.get('/', function (req, res) {
  console.log('Got a message');
  res.send('Hello World')
});

// Add controllers to the api
for (let controller of _.values(controllers)) {
  app.use('/api', new controller().router);
}

app.listen(process.env.PORT, () => console.log('Listening on port', process.env.PORT));
