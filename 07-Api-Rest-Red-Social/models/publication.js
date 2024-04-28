const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const PublicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  file: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

PublicationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(
  "Publication",
  PublicationSchema,
  "publications"
);
