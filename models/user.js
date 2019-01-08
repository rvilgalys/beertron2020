const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  draftList: [
    {
      type: Schema.Types.ObjectId,
      ref: "Beer"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
