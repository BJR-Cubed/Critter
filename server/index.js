'use strict';

const { authSequelize } = require('./auth/models');
const { start } = require('./server');
const PORT = process.env.PORT || 3000;

authSequelize.sync()
  .then(() => {
    console.log('Auth DB is synced');
    start(PORT);
  })
  .catch(console.error);

/* const { authDb } = require('./src/auth/models');
  
  await authDb.sync(); */

