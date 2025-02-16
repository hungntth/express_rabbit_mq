require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Redis = require("ioredis");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const logger = require("./utils/logger");
const proxy = require("express-http-proxy");
const errorHandler = require("./middleware/errorHandler");
const notFoundHandler = require("./middleware/notFoundHandler");

const app = express();

const redisClient = new Redis(process.env.REDIS_URL);

app.use(helmet());
app.use(cors());
app.use(express.json());

const ratelimit = rateLimit({
  windowMs: 15 * 50 * 1000, // 15 phút
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ success: false, message: "too many requests" });
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});

app.use(ratelimit);

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

const proxyOptions = {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace(/^\/v1/, "/api");
  },

  proxyErrorHandler: (err, res, next) => {
    logger.error(`Proxy error: ${err.message}`);
    res.status(500).json({
      message: `Internal server error`,
      error: err.message,
    });
  },
};

app.use(
  "/v1/auth",
  proxy(process.env.IDENTITY_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["Content-Type"] = "application/json";
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, UserRes) => {
      logger.info(
        `Response received from Identity service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },
  })
);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
