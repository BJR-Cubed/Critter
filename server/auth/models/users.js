'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'secretstring';

const userModel = (sequelize, DataTypes) => {
  const model = sequelize.define('users', {
    displayName: { type: DataTypes.STRING, allowNull: false }, // Use allowNull: false, instead of required: true
    handle: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' },
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
    const user = await this.findOne({ where: {handle: parsedToken.handle} });
    if(user) { return user; }
    throw new Error('User Not Found');
  };

  return model;

};

module.exports = userModel;