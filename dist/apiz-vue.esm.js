import { APIz } from 'apiz-ng';
import { config } from 'tinyjx';
import Client from 'apiz-browser-client';

/* global false */
var installed = false;

function APIs(options) {
  // 这里不用new本来是没关系的, 但是他妈的V8有个bug...
  // 但是受限于TS的类型检查我又不能在这里用new
  // 那就只能在下面修复这个问题了
  return APIz(options.meta, Object.assign({
    immutableMeta: true,
    // defaultType: 'json',
    client: Client(options)
  }, options));
} // function isAnonymous(apis: any): apis is Instance {
// 	return apis instanceof APIz;
// }
// tslint:disable-next-line


APIs.install = function (Vue, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$pool = _ref.pool,
      pool = _ref$pool === void 0 ? 5 : _ref$pool;

  if (installed) {
    return;
  }

  installed = true;
  config({
    pool: pool
  }); // 其实我只想要hook根实例的beforeCreate而不是所有,
  // 然而好像没有什么很好的办法, 那就只能这样了
  // 至于为什么不直接通过options传入参数然后挂在
  // prototype上, 这样就可以不用使用mixin了, 因为
  // 我就希望API的调用方式是显式从根实例传入需要的参数
  // 而options则作为一些全局性的配置

  Vue.mixin({
    beforeCreate: function beforeCreate() {
      // 判断一下$root, 短路求值有利于减少其他组件实例化的判断
      if (this.$root === this && this.$options && this.$options.apis) {
        var apis = this.$options.apis;

        switch (true) {
          // switch true的话类型保护不起作用啊...
          // 看来只能手动as了
          // 本来instanceof是没什么问题的, 但是V8最近的版本有个bug, 这里会得到false
          // 所以换Object.getPrototypeOf
          // case apis instanceof APIz:
          case Object.getPrototypeOf(Object.getPrototypeOf(apis)) === APIz.prototype:
            Vue.prototype.$apis = apis;
            break;

          case Array.isArray(apis):
            apis.forEach(function (item) {
              return Vue.prototype[item.name] = item.apiGroup;
            });
            break;

          case typeof apis.name === 'string' && apis.apiGroup instanceof APIz:
            Vue.prototype[apis.name] = apis.apiGroup;
            break;

          default:
            throw new TypeError('apis must be an Object or an Array');
        }
      }
    }
  });
};

if (window && window.Vue) {
  window.Vue.use(APIs);
}

export default APIs;
//# sourceMappingURL=apiz-vue.esm.js.map
