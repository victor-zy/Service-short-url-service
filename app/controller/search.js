'use strict';
const Controller = require('egg').Controller;

class SearchController extends Controller {
    async index() {
        const {ctx} = this;
        const short_url_code = ctx.params.short_url_code;
        console.log('11111111:'+ short_url_code);
        const result = await ctx.service.user.search(short_url_code);
        console.log('result: ' + result);
        var origin  = 'https://'+ result;
        ctx.redirect(origin);
    }
}

module.exports = SearchController;