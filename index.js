const Koa = require("koa");
const app = new Koa();

const { connect, initSchemas } = require("./database/init");

const koaBody = require("koa-body");

const cors = require("koa2-cors");
const mongoose = require("mongoose");
const Router = require("koa-router");

app.use(cors());

app.use(
  koaBody({
    enableTypes: ["json", "form", "text"],
    multipart: true,
  })
);
const router = new Router();

router.post("/login", async (ctx) => {
  const loginUser = ctx.request.body;
  const { userName, password } = loginUser;
  console.log("**********", userName);
  const User = mongoose.model("User");
  await User.findOne({ userName })
    .exec()
    .then(async (res) => {
      if (res) {
        const newUser = new User();
        await newUser
          .comparePassword(password, res.password)
          .then(() => {
            ctx.body = { code: 200, message: res };
          })
          .catch(() => {
            ctx.body = { code: 500, message: "密码错误" };
          });
      } else {
        ctx.body = { code: 500, message: "用户名不存在" };
      }
    })
    .catch(() => {
      ctx.body = { code: 500, message: "登陆失败" };
    });
});

router.post("/person", async (ctx) => {
  try {
    const { userName } = ctx.request.body;
    console.log("**********", userName);
    const Person = mongoose.model("Person");
    await Person.findOne({ userName }).update({ lastTime: Date.now() }).exec();
    ctx.body = { code: 200, data: await Person.findOne({ userName }) };
  } catch (err) {
    ctx.body = { code: 500, message: err };
  }
});

router.post("/person/todo", async (ctx) => {
  try {
    const { userName, todoList } = ctx.request.body;
    const Person = mongoose.model("Person");
    await Person.findOne({ userName }).update({ todoList }).exec();
    const res = await Person.findOne({ userName }).exec();
    ctx.body = {
      code: 200,
      data: res,
    };
  } catch (err) {
    ctx.body = { code: 500, message: err };
  }
});

router.post("/account", async (ctx) => {
  const { userName } = ctx.request.body;
  const User = mongoose.model("User");
  try {
    const res = await User.findOne({ userName }).exec();
    ctx.body = { code: 200, data: res };
  } catch (err) {
    ctx.body = { code: 500, data: err };
  }
});

router.post("/account/change", async (ctx) => {
  const { userName, password } = ctx.request.body;
  const User = mongoose.model("User");
  try {
    await User.findOne({ userName }).update({ password }).exec();
    const res = await User.findOne({ userName });
    ctx.body = { code: 200, data: res };
  } catch (err) {
    ctx.body = { code: 500, data: err };
  }
});

router.post("/account/add", async (ctx) => {
  const {
    userName,
    newUserName,
    newPassword,
    newPermissions,
    newMember,
  } = ctx.request.body;
  const User = mongoose.model("User");
  const Person = mongoose.model("Person");
  const Account = mongoose.model("Account");

  const newUser = new User({
    userName: newUserName,
    password: newPassword,
    permissions: newPermissions,
    createAt: Date.now(),
    lastLoginAt: Date.now(),
  });

  const newPerson = new Person({
    userName: newUserName,
    permissions: newPermissions,
    lastTime: Date.now(),
    opinion: [335, 310, 234, 135, 1548],
    readPersonData: ["36.3", "44.1", "18.7", "5.9"],
    readData: {
      personNums: [1600, 1275, 3260, 3830, 2141, 2454, 2710],
      money: [300, 182, 434, 791, 390, 200, 310],
    },
    todoList: [{ status: false, title: "吃饭" }],
    readNum: 1000,
    eventNum: 12,
    earningsNum: 288,
  });
  console.log("newMember", newMember);
  const newAccount2 = new Account({ userName: newUserName, member: [] });
  Account.findOne({ userName }).update({ member: newMember }).exec();
  console.log(ctx.request.body);
  try {
    await newUser.save();
    await newPerson.save();
    await newAccount2.save();
    ctx.body = { code: 200, message: res };
  } catch (err) {
    ctx.body = { code: 500, message: err };
  }
});

router.post("/account/delete", async (ctx) => {
  console.log(ctx.request.body);
  const { userName, deleteUser, memberList } = ctx.request.body;
  const User = mongoose.model("User");
  const Person = mongoose.model("Person");
  const Account = mongoose.model("Account");
  try {
    await User.findOne({ userName: deleteUser }).remove();
    await Person.findOne({ userName: deleteUser }).remove();
    await Account.findOne({ userName: deleteUser }).remove();
    const newList = memberList.filter((item) => item !== deleteUser);
    const res = await Account.findOne({ userName }).update({ member: newList });
    console.log(newList);
    ctx.body = { code: 200, message: res };
  } catch (err) {
    ctx.body = { code: 500, message: err };
  }
});

router.post("/account/list", async (ctx) => {
  const { userName } = ctx.request.body;
  const Account = mongoose.model("Account");
  const Person = mongoose.model("Person");
  const User = mongoose.model("User");
  const Article = mongoose.model("Article");

  try {
    const [{ member }] = await Account.find({ userName }).exec();
    console.log(member);

    let res = [];
    let userRes = [];
    let articalRes = [];

    let result = [];
    let userResult = [];
    let articalResult = [];

    member.forEach((item, index) => {
      userRes[index] = User.find({ userName: item }).exec();
      res[index] = Person.find({ userName: item }).exec();
      articalRes[index] = Article.find({ userName: item }).exec();
    });

    await Promise.all(res).then((r) => (result = r));
    await Promise.all(userRes).then((r) => (userResult = r));
    await Promise.all(articalRes).then((r) => (articalResult = r));

    ctx.body = {
      code: 200,
      data: { result, userResult, articalResult, member },
    };
  } catch (err) {
    ctx.body = { code: 500, message: err };
  }
});

router.post("/audit", async (ctx) => {
  const { userName } = ctx.request.body;
  console.log(userName);
  const Account = mongoose.model("Account");
  const Article = mongoose.model("Article");
  try {
    const { member } = await Account.findOne({ userName }).exec();
    console.log(member);
    let res = [];
    let result = [];
    member.forEach((item, index) => {
      res[index] = Article.find({ userName: item, status: "pendding" }).exec();
    });
    await Promise.all(res).then((r) => (result = r));
    ctx.body = { code: 200, data: result };
  } catch (err) {
    ctx.body = { code: 500, message: err };
  }
});

router.post("/audit/agree", async (ctx) => {
  const { userName, title } = ctx.request.body;
  const Article = mongoose.model("Article");
  try {
    await Article.findOne({ userName, title }).update({ status: "true" });
    ctx.body = { code: 200, data: "同意成功" };
  } catch (err) {
    ctx.body = { code: 500, data: "同意失败" };
  }
});

router.post("/audit/refuse", async (ctx) => {
  const { userName, title } = ctx.request.body;
  const Article = mongoose.model("Article");
  try {
    await Article.findOne({ userName, title }).update({ status: "false" });
    ctx.body = { code: 200, data: "拒绝成功" };
  } catch (err) {
    ctx.body = { code: 500, data: "拒绝失败" };
  }
});

router.post("/article/list", async (ctx) => {
  const { userName } = ctx.request.body;
  const Article = mongoose.model("Article");
  console.log(userName);
  try {
    const res = await Article.find({ userName }).exec();
    console.log(res);
    ctx.body = { code: 200, data: res };
  } catch (err) {
    ctx.body = { code: 500, message: err };
  }
});

router.post("/article/delete", async (ctx) => {
  const { _id } = ctx.request.body;
  const Article = mongoose.model("Article");
  try {
    const res = await Article.find({ _id }).remove();
    ctx.body = { code: 200, data: res };
  } catch (err) {
    ctx.body = { code: 500, message: err };
  }
});

router.post("/upload", async (ctx) => {
  const Article = mongoose.model("Article");
  const newArticle = new Article(ctx.request.body);
  try {
    const res = await newArticle.save();
    console.log(res);
    ctx.body = { code: 200, message: res };
  } catch (err) {
    console.log(err);

    ctx.body = { code: 500, message: err };
  }
});

router.post("/reader", async (ctx) => {
  const { userName } = ctx.request.body;
  const Reader = mongoose.model("Reader");
  try {
    const res = await Reader.find({ userName }).exec();
    console.log(res);
    ctx.body = { code: 200, data: res };
  } catch (err) {
    console.log(err);

    ctx.body = { code: 500, message: err };
  }
});

router.post("/reader/reply", async (ctx) => {
  const { context, _id } = ctx.request.body;
  const Reader = mongoose.model("Reader");
  try {
    const res = await Reader.findOne({ _id }).update({
      context,
      statue: "true",
    });
    console.log(res);
    ctx.body = { code: 200, data: res };
  } catch (err) {
    console.log(err);

    ctx.body = { code: 500, message: err };
  }
});

router.post("/reader/add", async (ctx) => {
  const { userName, readerName, messageContext, title } = ctx.request.body;
  const Reader = mongoose.model("Reader");
  const newReader = new Reader({
    userName,
    title,
    readerName,
    messageTime: new Date(),
    messageContext,
    statue: "false",
    context: "",
  });
  try {
    const res = await newReader.save();
    console.log("-------------------------------");
    console.log(res);
    ctx.body = { code: 200, message: res };
  } catch (err) {
    ctx.body = { code: 500, message: err };
  }
});

router.post("/task", async (ctx) => {
  const Task = mongoose.model("Task");
  try {
    const res = await Task.find().exec();
    ctx.body = { code: 200, data: res };
  } catch (err) {
    console.log(err);
    ctx.body = { code: 500, message: err };
  }
});
router.post("/task/add", async (ctx) => {
  const body = ctx.request.body;
  console.log(body);
  const Task = mongoose.model("Task");
  const newTask = new Task({ ...body, accept: "" });
  try {
    const res = await newTask.save();
    console.log(res);
    ctx.body = { code: 200, data: res };
  } catch (err) {
    console.log(err);
    ctx.body = { code: 500, message: err };
  }
});

router.post("/task/choose", async (ctx) => {
  const { _id, userName } = ctx.request.body;
  console.log(ctx);
  const Task = mongoose.model("Task");
  try {
    const res = await Task.find({ _id }).update({ accept: userName });
    ctx.body = { code: 200, data: res };
  } catch (error) {
    ctx.body = { code: 500, message: err };
  }
});

app.use(router.routes());
app.use(router.allowedMethods);

(async () => {
  await connect();
  initSchemas();
})();

app.listen(3000, () => {
  console.log("start");
});
