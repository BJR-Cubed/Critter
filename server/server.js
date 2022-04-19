'use strict';

const authRouter = require('./auth/routes.js');

/* const { authDb } = require('./src/auth/models');
  
  await authDb.sync(); */

const express  = require ('express');

const app = express();

const cors = require ('cors');

app.use(cors());
app.use(express.json());
app.use(authRouter);

// app.use('/', (req, res, next) => {
//   console.log('route hit');
//   res.status(204).send('204 code means no content');
// });

app.use('*', (req, res, next) => {

  let error404 = new Error(`Guys, cannot ${req.method} at ${req.route}.`);
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
