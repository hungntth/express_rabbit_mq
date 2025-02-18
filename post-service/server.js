const app = require("./src/app");
const { connectRabbitMQ } = require("./src/utils/rabbitmq");

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, async() => {
  await connectRabbitMQ();
  console.log(`WSV start with port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit server express, now!");
  });
});
