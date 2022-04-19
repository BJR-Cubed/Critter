'use strict';

const express = require('express');
const router = express.Router();

const { users } = require('./models');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');

router.post('/signup', async (req, res, next) => {
  try {
    let userRecord = await users.create(req.body);
    console.log('signup route hit');
    res.status(200).json(userRecord); // using .json instead of .send
  } catch (error) {
    console.error(error);
    next(error);
  }

});

router.post('/signin', basicAuth, (req, res, next) => {
  console.log('signin route hit');
  res.status(200).json({
    user: req.user,
    token: req.user.token,
  });
  // res.status(200).send('Signin proof of life!');

});

router.get('/users', bearerAuth, async (req, res, next) => {
  let userTable = await users.findAll({});
  console.log('users route hit');
  res.status(200).json(userTable);
});

module.exports = router;
