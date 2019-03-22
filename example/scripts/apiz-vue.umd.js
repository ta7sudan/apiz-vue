(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('apiz-ng'), require('tinyjx'), require('apiz-browser-client')) :
	typeof define === 'function' && define.amd ? define(['apiz-ng', 'tinyjx', 'apiz-browser-client'], factory) :
	(global = global || self, global['@lowb/apiz-vue'] = factory(global.apizNg, global.tinyjx, global.Client));
}(this, function (apizNg, tinyjx, Client) { 'use strict';

	Client = Client && Client.hasOwnProperty('default') ? Client['default'] : Client;

	/* global true */
	let installed = false;
	// type APIs = Instance | Array<NamedInstance> | NamedInstance;
	function APIs(options) {
	    return apizNg.APIz(options.meta, Object.assign({ immutableMeta: true, 
	        // defaultType: 'json',
	        client: Client(options) }, options));
	}
	// function isAnonymous(apis: any): apis is Instance {
	// 	return apis instanceof APIz;
	// }
	// tslint:disable-next-line
	APIs.install = function (Vue, { pool = 5 } = {}) {
	    if (installed) {
	        return;
	    }
	    installed = true;
	    tinyjx.config({
	        pool
	    });
	    // 其实我只想要hook根实例的beforeCreate而不是所有,
	    // 然而好像没有什么很好的办法, 那就只能这样了
	    // 至于为什么不直接通过options传入参数然后挂在
	    // prototype上, 这样就可以不用使用mixin了, 因为
	    // 我就希望API的调用方式是显式从根实例传入需要的参数
	    // 而options则作为一些全局性的配置
	    Vue.mixin({
	        beforeCreate() {
	            // 判断一下$root, 短路求值有利于减少其他组件实例化的判断
	            if (this.$root === this && this.$options && this.$options.apis) {
	                const apis = this.$options.apis;
	                switch (true) {
	                    // switch true的话类型保护不起作用啊...
	                    // 看来只能手动as了
	                    case apis instanceof apizNg.APIz:
	                        Vue.prototype.$apis = apis;
	                        break;
	                    case Array.isArray(apis):
	                        apis.forEach(item => Vue.prototype[item.name] = item.apiGroup);
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
