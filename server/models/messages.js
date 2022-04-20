'use strict';

const messageModel = (sequelize, DataTypes) => {
  const model = sequelize.define('messages', {
    author: { type: DataTypes.STRING, allowNull: false },
    timestamp: { type: DataTypes.INTEGER, allowNull: false },
    body: { type: DataTypes.STRING, allowNull: false },
    length: { type: DataTypes.INTEGER, allowNull: false },
    // Stretch goal
    // tags
    // recipients
  });

  return model;
};

module.exports = messageModel;
