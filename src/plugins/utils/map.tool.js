/*
 * 地区工具
 * @Author: liangzc 
 * @Date: 2018-05-26 10:04:03 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-05-26 10:32:45
 */
let MapTools = (function() {
  /**
   * 根据省份名称返回省份简称
   * @param province
   * @returns {String}
   */
  function provinceShort(province) {
    return (
      {
        北京市: '京',
        天津市: '津',
        重庆市: '渝',
        上海市: '沪',
        河北省: '冀',
        山西省: '晋',
        辽宁省: '辽',
        吉林省: '吉',
        黑龙江省: '黑',
        江苏省: '苏',
        浙江省: '浙',
        安徽省: '皖',
        福建省: '闽',
        江西省: '赣',
        山东省: '鲁',
        河南省: '豫',
        湖北省: '鄂',
        湖南省: '湘',
        广东省: '粤',
        海南省: '琼',
        四川省: '川/蜀',
        贵州省: '黔/贵',
        云南省: '云/滇',
        陕西省: '陕/秦',
        甘肃省: '甘/陇',
        青海省: '青',
        台湾省: '台',
        内蒙古自治区: '内蒙古',
        广西壮族自治区: '桂',
        宁夏回族自治区: '宁',
        新疆维吾尔自治区: '新',
        西藏自治区: '藏',
        香港特别行政区: '港',
        澳门特别行政区: '澳'
      }[province] || province
    );
  }
  /**
   * 获取当前定位地址
   */
  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!window.AMap) {
        let { lazyAMapApiLoaderInstance } = require('vue-amap');
        let _loadApiPromise = lazyAMapApiLoaderInstance.load();
        _loadApiPromise.then(() => {
          MapTools._geolocation = new AMap.Geolocation();
          MapTools._geolocation.getCurrentPosition((status, result) => {
            status === 'complete' ?
              (result.addressComponent = result.addressComponent || {},
              result.addressComponent.provinceShort = provinceShort(
                result.addressComponent.province
              ),
              resolve(result)) :
              reject({ status, result });
          });
        });
      } else {
        MapTools._geolocation = MapTools._geolocation || new AMap.Geolocation();
        MapTools._geolocation.getCurrentPosition((status, result) => {
          status === 'complete' ?
            (result.addressComponent = result.addressComponent || {},
            result.addressComponent.provinceShort = provinceShort(
              result.addressComponent.province
            ),
            resolve(result)) :
            reject({ status, result });
        });
      }
    });
  }

  return {
    provinceShort: provinceShort, //省份简称
    getCurrentPosition: getCurrentPosition //获取当前定位地址
  };
})();

typeof exports === 'object' && typeof module !== 'undefined' ?
  module.exports = MapTools :
  window.MapTools = MapTools;
