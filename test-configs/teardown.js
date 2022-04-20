'use strict';

const { authSequelize } = require('../server/auth/models');
const { contentSequelize } = require('../server/models/');

module.exports = () => {
  authSequelize.drop();
  contentSequelize.drop();
};