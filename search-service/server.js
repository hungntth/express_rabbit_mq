const app = require("./src/app");
const {
  handlerPostCreated,
  handlePostDeleted,
} = require("./src/eventHandlers/search.eventHandler");
const { consumeEvent } = require("./src/utils/rabbitmq");
const { connectRabbitMQ } = require("./src/utils/rabbitmq");

const PORT = process.env.PORT || 3004;

const server = app.listen(PORT, async () => {
  await connectRabbitMQ();
  await consumeEvent("post.created", handlerPostCreated);
  await consumeEvent("post.deleted", handlePostDeleted);
  console.log(`WSV start with port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit server express, now!");
  });
});
