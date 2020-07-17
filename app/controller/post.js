'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  // async index() {
  //   const { ctx } = this;
  //   // console.log(ctx);
  //   ctx.body = {
  //     name: `hello ${ctx.params.id}`,
  //   };
  // }

  async shorturl() {
    const { ctx } = this;
    // ctx.body = `body: ${JSON.stringify(ctx.request.body)}`;
    // console.log(ctx.request.body.originurl);
    var origin_url =  ctx.request.body.originurl;
    var short_url = await ctx.service.user.find(origin_url);
    ctx.body = short_url;
    ctx.status = 201;
  }

  async createshorturl() {
    const { ctx } = this;
    var origin_url = ctx.request.body.origin_url;
    var time = ctx.request.body.time;
    var short_url = await ctx.service.user.createshorturl(origin_url,time);
    ctx.body = short_url;
  }
}
module.exports = HomeController;
