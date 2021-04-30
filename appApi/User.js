const Router = require("koa-router");
const mongoose = require("mongoose");
const router = new Router();
const bodyParser = require("koa-bodyparser");
const koaBody = require("koa-body");

router.get("/", async (ctx) => {
  ctx.body = "1111";
});

router.post("/register", async (ctx) => {
  console.log(ctx.request);
  ctx.body = ctx.request;
  console.log("222");

});

module.exports = router;
