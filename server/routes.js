'use strict';

const express = require('express');
const router = express.Router();
const { messages } = require('./models');

const bearerAuth = require('./auth/middleware/bearer.js');
const accessAuth = require('./auth/middleware/access.js');

router.post('/messages', bearerAuth, async (req, res, next) => {
  try {
    if (!req.body) throw new Error('No req.body');
    // console.log('Type of messages', typeof(messages));
    console.log(req.body);
    // console.log(req.user);
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

router.get('/messages', bearerAuth, async (req, res, next) => {
  try {
    let records = await messages.findAll({});
    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/messages/:id', bearerAuth, async (req, res, next) => {
  try {
    let record = await messages.findOne({ where: { id: req.params.id } });
    if (!record) throw new Error('Record not found');
    res.status(200).json(record);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put('/messages/:id', bearerAuth, accessAuth, async (req, res, next) => {
  try {
    let record = await messages.update(req.body, { where: { id: req.params.id } });
    if (record[0] === 0) {
      throw new Error('Record not found');
    }
    let updatedRecord = await messages.findOne({ id: req.params.id });
    // console.log(req.body.body);
    // console.log(updatedRecord);
    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/messages/:id', bearerAuth, accessAuth, async (req, res, next) => {
  try {
    let deletedRecord = await messages.findOne({ id: req.params.id });
    if (deletedRecord) {
      await messages.destroy({ where: { id: req.params.id } });
      res.status(204).send('Message Deleted');
    } else {
      throw new Error('Record not found');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Create our routes here

// and have a huge mess of code to create a timestamp, author, calculate the length, etc



module.exports = router;
