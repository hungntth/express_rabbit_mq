const app = require("./src/app");
const logger = require("./src/utils/logger");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`API GATEWAY RUNNING PORT ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit server express, now!");
  });
});
