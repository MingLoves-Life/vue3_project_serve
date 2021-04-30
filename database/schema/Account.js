const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  userName: { unique: true, type: String },
  member: { type: Array },
});

mongoose.model("Account", accountSchema);
