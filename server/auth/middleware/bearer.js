'use strict';

const { users } = require('../models');

module.exports = async (req, res, next) => {
  try {

    if(!req.headers.authorization) { return _authError(); }
    const token = req.headers.authorization.split(' ').pop();
    const validUser = await users.authenticateToken(token);
    req.user = validUser;
    req.token = validUser.token;
    next();
  } catch(e) {
    console.error(e);
    _authError();
  }

  function _authError(){
    let error = new Error('Invalid Login');
    error.status = 403;
    next(error);
  }
};
