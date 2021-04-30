const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  UserId: ObjectId,
  userName: { unique: true, type: String },
  password: { type: String },
  permissions: { type: String },
  createAt: { type: Date, default: Date.now() },
  lastLoginAt: { type: Date, default: Date.now() },
});

userSchema.methods = {
  comparePassword: (_password, password) => {
    return new Promise((resolve, reject) => {
      _password === password ? resolve() : reject();
    });
  },
};
mongoose.model("User", userSchema);
