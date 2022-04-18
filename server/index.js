'use strict';

const PORT = process.env.PORT || 3000;


const express  = require ('express');

const app = express();

const cors = require ('cors');

app.use(cors());
app.use(express.json());

app.use('*', (req, res, next) => {

  let error404 = new Error(`cannot ${req.method}`);

});

app.listen(PORT, () => {
  console.log('api is listening on ', PORT);
})

module.exports = app;