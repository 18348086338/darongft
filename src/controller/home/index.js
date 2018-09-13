const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    const req = this.ctx.req;
    const res = this.ctx.res;
    console.log('这里是控制器打印数据', req, res);
    this.meta_title = '首页'; // 标题1
    // this.keywords = this.config('setup.WEB_SITE_KEYWORD')
    //   ? this.config('setup.WEB_SITE_KEYWORD')
    //   : ''; // seo关键词
    // this.description = this.config('setup.WEB_SITE_DESCRIPTION')
    //   ? this.config('setup.WEB_SITE_DESCRIPTION')
    //   : ''; // seo描述
    // this.active = ['/', '/index', '/index.html'];
    this.assign({
      pageTitle: '达荣丰泰',
      name: '这是一个pug',
      foog: true,
      youAreUsingPug: true,
      headJson: {
        logoSrc: '/static/image/logo.gif'
      }
    }); // 给模板赋值
    return this.display();
  }
  __call() {
    // 如果相应的Action不存在则调用该方法
  }
};
