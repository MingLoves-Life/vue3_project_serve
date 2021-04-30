const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const readerSchame = new Schema({
  userName: { type: String },
  title: { type: String },
  readerName: { type: String },
  messageTime: { type: Date },
  statue: { type: String },
  messageContext: { type: String },
  context: { type: String },
});

mongoose.model("Reader", readerSchame);
