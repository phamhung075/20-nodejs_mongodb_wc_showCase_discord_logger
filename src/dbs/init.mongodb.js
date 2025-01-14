"use strict";

const mongoose = require("mongoose");
const {
  db: { host, port, name, username, password },
} = require("../configs/config.mongodb");

const env = process.env.NODE_ENV || 'dev';

let connectString;

if (env === 'dev') {
  connectString = `mongodb://${host}:${port}/${name}`;
} else {
  connectString = `mongodb+srv://${username}:${password}@${host}/${name}`;
}

console.log(`Environment: ${env}`);
console.log(`Connecting to: ${host}/${name}`);

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    if (env === 'dev') {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => console.log(`Connected Mongodb Success (${env} environment)`))
      .catch((err) => console.log(`MongoDB Connect Error:`, err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;