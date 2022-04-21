'use strict';

const base64 = require('base-64');

const { users } = require('../models');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    return _authError();
  }
  try {
    let basic = req.headers.authorization.split(' ').pop();
    console.log(basic, 'is basic'); //0g==
    let [ user, pass ] = base64.decode(basic).split(':');
    req.user = await users.authenticateBasic(user, pass);
    next();
  } catch(error) {
    console.error(error);
    _authError();
  }
  
  function _authError () {
    res.status(403).send('invalid Login');
  }
};