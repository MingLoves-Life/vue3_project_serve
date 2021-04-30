const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchame = new Schema({
  userName: { type: String },
  type: { type: String },
  website: { type: String },
  createTime: { type: Date, default: Date.now() },
  downTime: { type: String },
  context: { type: String },
  accept: { type: String },
});

mongoose.model("Task", taskSchame);
