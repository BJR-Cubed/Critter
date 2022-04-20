'use strict';

const express = require('express');
const router = express.Router();
const { messages } = require('./models');

const bearerAuth = require('./auth/middleware/bearer.js');
const accessAuth = require('./auth/middleware/access.js');

router.post('/messages', bearerAuth, async (req, res, next) => {
  try {
    if (!req.body) throw new Error('No req.body');
    let newRecord = await messages.create({ 
      ...req.body,
      timestamp: Date.now(),
      length: req.body.body.length,
      author: req.user.handle,
    });

    res.status(201).json(newRecord);
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
    let updatedRecord = await messages.findOne({ where: { id: req.params.id } });
    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/messages/:id', bearerAuth, accessAuth, async (req, res, next) => {
  try {
    let deletedRecord = await messages.findOne({ where: { id: req.params.id } });
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

module.exports = router;
