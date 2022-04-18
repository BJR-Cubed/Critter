'use strict';

const { Sequelize, DataTypes } = require('sequelize');

const userModel = require('./users');

// This will assign the Heroku-specific configs if the database is deployed.
const sequelizeConfig = process.env.DATABASE_URL ?
  {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }, 
    },
  } :
  {};

const dbUrl = process.env.DATABASE_URL || 'sqlite::memory';

const sequelize = new Sequelize(dbUrl, sequelizeConfig);

module.exports = {
  authSequelize: sequelize,
  users: userModel(sequelize, DataTypes),
};
