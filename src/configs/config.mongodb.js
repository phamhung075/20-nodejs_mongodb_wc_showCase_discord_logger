"use strict";

require('dotenv').config();

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3052
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'shopDEV'
  }
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000
  },
  db: {
    host: process.env.PRO_DB_HOST,
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || 'shopPRO',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  }
};

const config = { dev, pro };
const env = process.env.NODE_ENV || 'dev';

console.log('Config environment:', env);

module.exports = config[env];