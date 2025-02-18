const app = require("./src/app");
const { handlePostDeleted } = require("./src/eventHandlers/media.eventHandler");
const { connectRabbitMQ, consumeEvent } = require("./src/utils/rabbitmq");

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, async () => {
  await connectRabbitMQ();
  await consumeEvent("post.deleted", handlePostDeleted);
  console.log(`WSV start with port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit server express, now!");
  });
});
