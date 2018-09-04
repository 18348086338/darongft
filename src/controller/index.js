const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
  	this.assign('title', '网页title测试');
    return this.display();
  }
};
