'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // router.get('/:id', controller.post.index);

  // 根据origin_url得到short-url
  router.post('/short-url', controller.post.shorturl);

  // 创建短链
  router.post('/shorturl',controller.post.createshorturl);

  // 短链重定向
  router.get('/:short_url_code',controller.search.index);

};
