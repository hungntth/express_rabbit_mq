const cloudinary = require("cloudinary").v2;
const logger = require("./logger");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadMediaToCloud = ({ file }) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          logger.error("error while uploading media to cloudinary", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

const deleteMediaCloud = async ({ publicId }) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info("Media deleted successfuly from cloud storage", publicId);
    return result;
  } catch (e) {
    logger.error("error deleting media frome cloudinary", e);
  }
};

module.exports = { uploadMediaToCloud, deleteMediaCloud };
