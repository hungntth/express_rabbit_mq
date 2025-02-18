const { BadRequestError } = require("../core/error.response");
const Media = require("../models/Media");
const { uploadMediaToCloud } = require("../utils/cloudinary");

const uploadMedia = async ({ file, userId }) => {
  if (!file)
    throw new BadRequestError("No file found. Please add a file an try again!");

  const { originalname, mimetype, buffer } = file;
  console.log(file);

  const cloudinaryUploadResult = await uploadMediaToCloud({ file });

  const newlyCreatedMedia = new Media({
    publicId: cloudinaryUploadResult.public_id,
    originalName: originalname,
    mimeType: mimetype,
    url: cloudinaryUploadResult.secure_url,
    userId,
  });

  await newlyCreatedMedia.save();
  return {
    url: newlyCreatedMedia.url,
  };
};

const getAllMedias = async () => {
  const results = await Media.find();
  return results;
};

module.exports = {
  uploadMedia,
  getAllMedias,
};
