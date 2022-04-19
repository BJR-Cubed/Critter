'use strict';

const express = require('express');
const router = express.Router();

const bearerAuth = require('./auth/middleware/bearer.js');

router.post('/messages', async (req, res, next) => {
  try {
    res.status(201).send('i am content');
    console.log('proof of life');
  } catch (error) {
    console.error(error);
    next(error);
  }

});

module.exports = router;
