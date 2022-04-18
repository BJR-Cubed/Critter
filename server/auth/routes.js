'use strict';

const express = require('express');
const router = express.Router();

const { users } = require('./models')

router.post('/signup', async (req, res, next) => {
  let userRecord = await users.create(req.body);
  console.log('signup route hit');
  res.status(200).send(userRecord);
});

router.post('/signin', (req, res, next) => {
  console.log('signin route hit');
  res.status(200).send('Signin Mission Accomplished!');
});

module.exports = router;
