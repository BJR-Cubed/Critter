'use strict';

const express = require('express');
const router = express.Router();


router.post('/signup', (req, res, next) => {
  console.log('signup route hit');
  res.status(200).send('Signup Mission Accomplished!');
});

router.post('/signin', (req, res, next) => {
  console.log('signin route hit');
  res.status(200).send('Signin Mission Accomplished!');
});

module.exports = router;
