(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('apiz-ng'), require('tinyjx'), require('apiz-browser-client')) :
  typeof define === 'function' && define.amd ? define(['apiz-ng', 'tinyjx', 'apiz-browser-client'], factory) :
  (global = global || self, global.APIs = factory(global.apizng, global.tinyjx, global.ApizClient));
}(this, function (apizNg, tinyjx, Client) { 'use strict';

  Client = Client && Client.hasOwnProperty('default') ? Client['default'] : Client;

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  var installed = false;

  function APIs(options) {
    // 这里不用new本来是没关系的, 但是他妈的V8有个bug...
    // 但是受限于TS的类型检查我又不能在这里用new
    // 那就只能在下面修复这个问题了
    return apizNg.APIz(options.meta, _extends({
      immutable: true,
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
    tinyjx.config({
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
            case Object.getPrototypeOf(Object.getPrototypeOf(apis)) === apizNg.APIz.prototype:
              Vue.prototype.$apis = apis;
              break;

            case Array.isArray(apis):
              apis.forEach(function (item) {
                return Vue.prototype[item.name] = item.apiGroup;
              });
              break;

            case typeof apis.name === 'string' && apis.apiGroup instanceof apizNg.APIz:
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

  return APIs;

}));
//# sourceMappingURL=apiz-vue.umd.js.map
