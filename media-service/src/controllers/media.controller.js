const { SuccessResponse } = require("../core/success.response");
const mediaService = require("../services/media.service");

class MediaController {
    uploadMedia = async (req, res) => {
    new SuccessResponse({
      message: "User registered successfully!",
      metadata: await mediaService.uploadMedia({
        file: req.file,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  getAllMedias = async (req, res) => {
    new SuccessResponse({
      message: "User registered successfully!",
      metadata: await mediaService.getAllMedias(),
    }).send(res);
  };
}

module.exports = new MediaController();
