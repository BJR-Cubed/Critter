'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'secretstring';

const userModel = (sequelize, DataTypes) => {
  const model = sequelize.define('users', {
    displayName: { type: DataTypes.STRING, required: true },
    handle: { type: DataTypes.STRING, required: true, unique: true },
    password: { type: DataTypes.STRING, required: true },
    role: { type: DataTypes.ENUM('user', 'admin'), required: true, defaultValue: 'user' },
    token: {
      type: DataTypes.VIRTUAL,
      get(){
        return jwt.sign({ handle: this.handle }, SECRET);
      },
      // set(tokenObj){
      //   let token = jwt.sign(tokenObj, SECRET);
      //   return token;
      // }
    },
  });

  model.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  model.authenticateBasic = async function(handle, password) {
    const user = await this.findOne({ where: { handle } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid){ return user; }
    throw new Error('Invalid User');
  };

  model.authenticateToken = async function(token) {
    const parsedToken = jwt.verify(token, SECRET);
    const user = await this.findOne({ where: {handle: parsedToken.username} });
    if(user) { return user; }
    throw new Error('User Not Found');
  };

  return model;

};

module.exports = userModel;