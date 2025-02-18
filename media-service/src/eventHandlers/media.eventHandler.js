const Media = require("../models/Media");
const { deleteMediaCloud } = require("../utils/cloudinary");

const handlePostDeleted = async (event) => {
  console.log(event, "event test");
  const { postId, mediasIds } = event;
  try {
    const mediaToDelete = await Media.find({ _id: { $in: mediasIds } });
    for (const media of mediaToDelete) {
      await deleteMediaCloud({ publicId: media.publicId });
      await Media.findByIdAndDelete(media._id);

      logger.info(
        `Deleted media ${media._id} associated with this deleted post ${postId}`
      );

      logger.info(`Processed deleted of media for post id ${postId}`);
    }
  } catch (e) {}
};

module.exports = { handlePostDeleted };
