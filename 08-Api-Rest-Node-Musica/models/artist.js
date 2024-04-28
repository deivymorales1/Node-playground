const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: "default.png",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

ArtistSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("Artist", ArtistSchema, "artists");
