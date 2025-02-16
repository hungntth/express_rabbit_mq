const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  midaIds: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.index({ context: "text" });

const Post = model("Post", postSchema);

module.exports = Post;
