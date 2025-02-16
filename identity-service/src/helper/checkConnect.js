"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

const _SECONDS = 60000;

const countConnect = () => {
  const numConnect = mongoose.connections.length;
  console.log(`Number of connection: ${numConnect}`);
};

const checkOverLoad = () => {
  setInterval(() => {
    const numConnect = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnections = numCores * 5;

    console.log(`Memory usage::: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnect > maxConnections) {
      console.log(`Connection overload detected`);
    }

    console.log(`Number of connection: ${numConnect}`);
  }, _SECONDS);
};

module.exports = {
  countConnect,
  checkOverLoad,
};
