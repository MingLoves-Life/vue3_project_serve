const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

const personSchame = new Scheme({
  userName: { unique: true, type: String },
  permissions: { type: String },
  lastTime: { type: Date },
  opinion: { type: Array },
  readPersonData: { type: Array },
  readData: { type: Object },
  todoList: { type: Array },
  readNum: { type: Number },
  eventNum: { type: Number },
  earningsNum: { type: Number },
});

mongoose.model("Person", personSchame);
