/*
 * 业务工具
 * @Author: liangzc 
 * @Date: 2018-05-26 10:04:03 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-06-27 16:49:17
 */
let BizTools = (function() {
  let MapOption;
  /**
   * 重置Model对象
   * @param {Object|Array} model model对象
   * @param {String|Array} ignore 忽略字段
   * @param {Boolean} deep 是否深度重置（内嵌对象重置）
   */
  function resetModel(model, ignore, deep) {
    if (typeof ignore === 'boolean') {
      deep = ignore;
      ignore = [];
    }
    ignore = Array.isArray(ignore) ? ignore : [ignore];
    if (Vue.$utils.is('Object', model)) {
      Vue.$utils.forEach(model, (value, key) => {
        if (Vue.$utils.inArray(key, ignore) >= 0) return true;
        if (Vue.$utils.is('Object', value)) {
          deep ? resetModel(value, ignore) : model[key] = {};
        } else if (Array.isArray(value)) {
          deep ?
            value.every(val => Vue.$utils.is('String', val)) ?
              model[key] = [] :
              value.forEach(vl => resetModel(vl, ignore)) :
            model[key] = [];
        } else {
          model[key] = '';
        }
      });
    } else if (Array.isArray(model)) {
      model.forEach(item => resetModel(item, ignore));
    }
    return model;
  }

  /**
   * 设置model
   * @param {Object} model 需要设置的对象
   * @param {Object} value 赋值来源
   * @param {Array} keys 需要赋值的键名
   */
  function setModelValue(model, value, keys) {
    if (!value) return model;
    if (keys && Array.isArray(keys)) {
      keys.forEach(key => {
        model[key] = value[key];
      });
    } else {
      Vue.$utils.forEach(value, (val, key) => {
        model[key] = val;
      });
    }
    return model;
  }

  /**
   * 跳转带支付页面
   * @param {String} path 跳转路径
   * @param {Boolean} replace 是否使用 replace
   */
  function goPay(vue, path, replace) {
    let complete = () => {
      //解决微信支付 "URL未注册"
      $globalConfig.navigator.isWechat &&
        navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/) &&
        location.reload();
    };
    replace ?
      vue.$router.replace(path, complete) :
      vue.$router.push(path, complete);
  }

  /**
   * 统一支付工具
   * @param {string} [url=''] 请求 url
   * @param {Object} [options={}] 请求参数
   * @returns Promise
   */
  function pay(url = '', options = {}) {
    return new Promise((resolve, reject) => {
      const messagebox = (error = {}) => {
        Vue.$messagebox.alert(error.message, '提示');
        reject(error);
      };

      if (Vue.$utils.isEmptyObject(options)) {
        console.warn('pay.options', options);
        messagebox({
          message: '支付参数异常'
        });
        return;
      }
      Vue.axios
        .post(url, options, {
          errorHandle: true //手动处理 axios 请求错误
        })
        .then(resp => {
          //请求接口成功
          const {
            payChannel, //支付渠道 0:微信 1:支付宝 2:停车点
            params, //微信支付参数
            tradeNO //支付宝支付参数
          } =
            resp || {};

          switch (String(payChannel)) {
            case '0': //微信
              if (!params || Vue.$utils.isEmptyObject(params)) {
                console.warn('pay.params', params);
                messagebox({
                  message: '微信支付下单异常'
                });
                break;
              }
              Vue.$uniquePay
                .wechatPay(params)
                .then(resp => {
                  console.log('pay.wechat', resp);
                  resolve(resp);
                })
                .catch(error => {
                  console.error('pay.wechat', error);
                  messagebox(error);
                });
              break;
            case '1': //支付宝
              if (Vue.$utils.isEmpty(tradeNO)) {
                console.warn('pay.tradeNO', tradeNO);
                messagebox({
                  message: '支付宝支付下单异常'
                });
                break;
              }
              Vue.$uniquePay
                .aliPay({
                  tradeNO
                })
                .then(resp => {
                  console.log('pay.alipay', resp);
                  resolve(resp);
                })
                .catch(error => {
                  console.error('pay.alipay', error);
                  messagebox(error);
                });
              break;
            case '2': //停车点
              Vue.bus.emit('resetAccount');
              resolve({});
              break;
            default:
              console.warn('pay.payChannel', payChannel);
              messagebox({
                message: '下单接口未返回支付渠道'
              });
              break;
          }
        })
        .catch(error => {
          messagebox(error);
        });
    });
  }

  /**
   * 转换字典项
   * @param {String} optionKey 字典项对应的 key
   * @param {*} code 字典Code
   * @param {*} defaultVal 默认值
   */
  function convertOption(optionKey, code, defaultVal) {
    if (!MapOption) {
      MapOption = require('@/js/mapOption').MapOption || {};
    }
    return (
      (
        Vue.$utils
          .get(MapOption, `${optionKey}.options`, [])
          .find(item => String(item.code) === String(code)) || {}
      ).label ||
      defaultVal ||
      ''
    );
  }

  /**
   * 获取字典项
   * @param {String} optionKey 字典项对应的 key， 支持路径，为空返回全部字典项
   */
  function mapOption(optionKey) {
    if (!MapOption) {
      MapOption = require('@/js/mapOption').MapOption || {};
    }
    return Vue.$utils.isEmpty(optionKey) ?
      MapOption :
      Vue.$utils.get(MapOption, optionKey, {});
  }

  /**
   * 微信/支付宝桥接函数
   */
  function onBridgeReady(callback) {
    let promise;
    // if no callback, return promise
    if (typeof callback !== 'function' && window.Promise) {
      promise = new Promise(resolve => {
        callback = function(bridge) {
          bridge && resolve(bridge, $globalConfig.navigator.ua);
        };
      });
    }
    if ($globalConfig.navigator.isWechat) {
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener(
            'WeixinJSBridgeReady',
            () => callback(WeixinJSBridge),
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', () =>
            callback(WeixinJSBridge)
          );
          document.attachEvent('onWeixinJSBridgeReady', () =>
            callback(WeixinJSBridge)
          );
        }
      } else {
        callback(WeixinJSBridge);
      }
    } else if ($globalConfig.navigator.isAlipay) {
      if (window.AlipayJSBridge) {
        callback(window.AlipayJSBridge);
      } else {
        document.addEventListener(
          'AlipayJSBridgeReady',
          () => callback(window.AlipayJSBridge),
          false
        );
      }
    }

    if (promise) {
      return promise;
    }
  }

  /**
   * 微信JSSDK注入
   * @return {Promise}
   */
  function wxConfig() {
    return new Promise((resolve, reject) => {
      if (!$globalConfig.navigator.isWechat) {
        // reject('微信jssdk仅在微信环境调用')
        return;
      }
      let errorCount = 0; //失败次数
      //获取js-sdk 签名
      let getSignature = () => {
        Vue.axios
          .get('app/v1/wx/getJsSdkCfgParam')
          .then(resp => {
            configSignature(resp);
          })
          .catch(function(error) {
            console.error('wxConfig', error);
          });
      };
      //注入 js-sdk
      let configSignature = config => {
        wx.config({
          beta: true,
          debug: $globalConfig.debug,
          appId: config.appId,
          timestamp: config.timestamp,
          nonceStr: config.nonceStr,
          signature: config.signature,
          jsApiList: [
            'checkJsApi',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'getNetworkType',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay'
          ]
        });
        wx.ready(() => {
          Vue.$utils.setSessionItem('wxSignatureData', config, true);
          resolve(wx);
        });
        wx.error(res => {
          console.error('wxConfig', res);
          errorCount++;
          Vue.$utils.setSessionItem('wxSignatureData', null);
          errorCount < 3 ?
            getSignature() :
            reject({
              code: 'fail',
              message: res.errMsg || res.err_desc || '微信jsapi配置失败'
            });
        });
      };

      //变相处理重复签名问题
      let signatureData = Vue.$utils.getSessionItem('wxSignatureData', true);
      if (signatureData && !Vue.$utils.isEmptyObject(signatureData)) {
        configSignature(signatureData);
      } else {
        getSignature();
      }
    });
  }

  return {
    resetModel: resetModel, //重置Model对象
    setModelValue: setModelValue, //设置Model 数据 setModelValue(obj, value);
    goPay: goPay, //跳转带有支付功能得页面，用于解决微信支付 URL未注册问题
    pay: pay, //统一支付工具
    convertOption: convertOption, //转换字典项
    mapOption: mapOption, //获取字典项,optionKey为空返回全部字典项
    onBridgeReady: onBridgeReady, //微信/支付宝桥接函数
    wxConfig: wxConfig //微信js-sdk配置
  };
})();

typeof exports === 'object' && typeof module !== 'undefined' ?
  module.exports = BizTools :
  window.BizTools = BizTools;
