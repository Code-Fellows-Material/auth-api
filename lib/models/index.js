'use strict';

const { Sequelize, DataTypes } = require('sequelize');

//Models
const clothesModel = require('./clothes/model.js');
const foodModel = require('./food/model.js');
const userModel = require('./users/model.js');
const Collection = require('./data-collection.js');

const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite:memory:' : process.env.DATABASE_URL;

const DATABASE_CONFIG = process.env.NODE_ENV === 'production' ? {
  dialectOptions: {
    ssl: true,
    rejectUnauthorized: false,
  }
} : {};

const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);
const food = foodModel(sequelize, DataTypes);
const clothes = clothesModel(sequelize, DataTypes);
const users = userModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  food: new Collection(food),
  clothes: new Collection(clothes),
  users: users,
};

