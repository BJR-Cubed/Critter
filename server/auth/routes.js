'use strict';

const express = require('express');
const router = express.Router();

const { users } = require('./models');

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

router.post('/signin', (req, res, next) => {
  console.log('signin route hit');
  res.status(200).send('Signin Mission Accomplished!');
});

router.get('/users', async (req, res, next) => {
  let userTable = await users.findAll({});
  console.log('users route hit');
  res.status(200).json(userTable);
});

module.exports = router;
