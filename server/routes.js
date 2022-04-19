'use strict';

const express = require('express');
const router = express.Router();
const { messages } = require('./models');

const bearerAuth = require('./auth/middleware/bearer.js');

router.post('/messages', bearerAuth, async (req, res, next) => {
  try {
    if(!req.body) throw new Error('No req.body');
    // console.log('Type of messages', typeof(messages));
    console.log(req.body);
    console.log(req.user);
    let newRecord = await messages.create({ // .create(req.body)
      ...req.body,
      timestamp: Date.now(),
      length: req.body.body.length,
      author: req.user.handle,
    });

    res.status(201).json(newRecord);
    console.log('proof of life');
  } catch (error) {
    console.error(error);
    next(error);
  }

});

// Create our routes here

// and have a huge mess of code to create a timestamp, author, calculate the length, etc



module.exports = router;
