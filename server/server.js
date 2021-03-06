'use strict';

const authRouter = require('./auth/routes.js');

const content = require('./routes');

const express  = require ('express');

const app = express();

const cors = require ('cors');

app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(content);

app.use('*', (req, res, next) => {

  let error404 = new Error(`Cannot ${req.method} at ${req.route}.`);
  error404.status = 404;
  next(error404);

});

module.exports = {
  app,
  start: port => {
    app.listen(port, () => {
      console.log('api is listening on ', port);
    });
  },
};
