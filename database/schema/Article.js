const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  userName: { type: String },
  type: { type: String },
  readTimes: { type: Number },
  money: { type: Number },
  website: { type: String },
  createTime: { type: Date },
  title: { type: String },
  context: { type: String },
  status: { type: String },
});

mongoose.model("Article", articleSchema);
