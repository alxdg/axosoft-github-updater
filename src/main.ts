require('dotenv').config();
import _ from 'lodash';
import express, { Response, Request } from 'express';
import morgan from 'morgan';

// Local Deps
import * as controllers from 'controllers';

const app = express()

app.use(express.json());
app.use(morgan('combined')); // Set logging to dev format

app.get('/', function (_req: Request, res: Response) {
  console.log('Logging healthcheck request.');
  res.sendStatus(200)
});

// Add controllers to the api
for (let controller of _.values(controllers)) {
  app.use('/api', new controller().router);
}

app.listen(process.env.PORT, () => console.log('Listening on port', process.env.PORT));
