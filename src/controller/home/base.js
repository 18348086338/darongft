module.exports = class extends think.Controller {
  __before() {
    // if (!user.isLogin) {
    //   return false; // 这里 return false，那么 xxxAction 和 __after 不再执行
    // }
  }
};
