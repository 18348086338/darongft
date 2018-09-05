const Base = require('./base.js');

module.exports = class extends Base {
	indexAction() {
		const req = this.ctx.req;
		const res = this.ctx.res;
		// console.log('这里是控制器打印数据', req, res);
		this.assign({
			pageTitle: '达荣丰泰',
			name: '这是一个pug',
			foog: true,
			youAreUsingPug: true
		}); // 给模板赋值
		return this.display();
	}
	__call() {
		// 如果相应的Action不存在则调用该方法
	}
};