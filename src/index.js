/* global DEBUG */
import { APIz } from 'apiz-ng';
import { config } from 'tinyjx';
import apizClient from 'apiz-browser-client';

let installed = false;

function APIs(options) {
	return new APIz(options.meta, {
		immutableMeta: true,
		defaultType: 'json',
		client: apizClient(options),
		...options
	});
}

APIs.install = function (Vue, { pool = 5 } = {}) {
	if (installed) {
		return;
	}
	installed = true;

	config({
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
					case apis instanceof APIz:
						Vue.prototype.$apis = apis;
						break;
					case Array.isArray(apis):
						apis.forEach(item => Vue.prototype[item.name] = item.apiGroup);
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