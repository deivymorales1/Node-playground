const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const AlbumSchema = new mongoose.Schema({
  artist: {
    type: mongoose.Schema.ObjectId,
    ref: "Artist",
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  year: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "default.png",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

AlbumSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Album", AlbumSchema, "albums");
