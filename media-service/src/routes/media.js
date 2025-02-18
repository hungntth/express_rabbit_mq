const express = require("express");
const { authenticateRequest } = require("../middleware/authMiddleware");
const asyncHandler = require("../helper/asyncHandler");
const router = express.Router();
const multer = require("multer");
const { BadRequestError } = require("../core/error.response");
const MediaController = require("./../controllers/media.controller");

// setup multer

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("file");

router.use(authenticateRequest);
router.post(
  "/upload",
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError)
        throw new BadRequestError("Multeer error while uploading");
      if (err) throw new BadRequestError("Multeer error while uploading");
      if (!req.file) throw new BadRequestError("No file upload");

      next();
    });
  },
  asyncHandler(MediaController.uploadMedia)
);
module.exports = router;
