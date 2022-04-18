'use strict';

const PORT = process.env.PORT || 3000;


const express  = require ('express');

const app = express();

const cors = require ('cors');

app.use(cors());
app.use(express.json());

app.use('/', (req, res, next) => {
  console.log('route hit');
  res.status(204).send('204 code means no content');
});

app.use('*', (req, res, next) => {

  let error404 = new Error(`Guys, cannot ${req.method} at ${req.route}.`);
  error404.status = 404;
  next(error404);

});

app.listen(PORT, () => {
  console.log('api is listening on ', PORT);
})

module.exports = app;