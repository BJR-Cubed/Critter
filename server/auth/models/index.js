'use strict';

const { Sequelize, DataTypes } = require('sequelize');

const userModel = require('./users');

// This will assign the Heroku-specific configs if the database is deployed.
const sequelizeConfig = process.env.HEROKU_POSTGRESQL_GOLD_URL ?
  {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }, 
    },
  } :
  {};

const dbUrl = process.env.HEROKU_POSTGRESQL_GOLD_URL || 'sqlite::memory';

const sequelize = new Sequelize(dbUrl, sequelizeConfig);

module.exports = {
  authSequelize: sequelize,
  users: userModel(sequelize, DataTypes),
};
