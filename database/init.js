const mongoose = require("mongoose");
const db = "mongodb://localhost/vue";
const glob = require("glob");
const { resolve } = require("path");

mongoose.Promise = global.Promise;

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, "./schema/", "**/*.js")).forEach(require);
};

exports.connect = () => {
  mongoose.set('useCreateIndex', true)
  mongoose.connect(db);

  let maxTimes = 0;
  return new Promise((resolve, reject) => {
    mongoose.connection.on("disconnected", () => {
      console.log("***********数据库断开***********");
      if (maxTimes < 3) {
        maxTimes++;
        mongoose.connect(db);
      } else {
        reject();
        throw new Error("数据库出现问题");
      }
    });

    mongoose.connection.on("error", (err) => {
      console.log("***********数据库错误***********");
      if (maxTimes < 3) {
        maxTimes++;
        mongoose.connect(db);
      } else {
        reject(err);
        throw new Error("数据库出现问题");
      }
    });

    mongoose.connection.once("open", () => {
      console.log("服务器建立连接");
      resolve();
    });
  });
};
