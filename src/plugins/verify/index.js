/*
 * @Author: focus 
 * @Date: 2017-06-22
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-05-18 15:36:28
 */
import verify from './verify';

// 配置项详见 ./props.js
// 方法详见   ./methods.js

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(verify);
}

export default verify;
