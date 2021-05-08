import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import { Routes } from './routes';
import { User } from './entity/User';

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as express.Express)[route.method](
        route.route,
        (req: Request, res: Response, next: express.NextFunction) => {
          // eslint-disable-next-line
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((outcome) =>
              outcome !== null && outcome !== undefined
                ? res.send(outcome)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    // insert new users for test
    await connection.manager.save(
      connection.manager.create(User, {
        firstName: 'Timber',
        lastName: 'Saw',
        age: 27,
      })
    );
    await connection.manager.save(
      connection.manager.create(User, {
        firstName: 'Phantom',
        lastName: 'Assassin',
        age: 24,
      })
    );
    // eslint-disable-next-line no-console
    console.log(
      'Express server has started on port 3000. Open http://localhost:3000/users to see results'
    );
  })
  // eslint-disable-next-line no-console
  .catch((error) => console.log(error));
