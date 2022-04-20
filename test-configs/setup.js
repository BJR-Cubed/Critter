'use strict';

const { authSequelize } = require('../server/auth/models');
const { contentSequelize } = require('../server/models/');

module.exports = async () => {
  await authSequelize.sync();
  await contentSequelize.sync();
  console.log('TEST Databases are synced');
};

