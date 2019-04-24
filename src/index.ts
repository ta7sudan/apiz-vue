/* global DEBUG */
// tslint:disable-next-line
import { APIz, APIzOptions, APIMeta, APIzInstance, HTTPMethodLowerCase } from 'apiz-ng';
import { config } from 'tinyjx';
// tslint:disable-next-line
import Client, { APIzClientInstance, APIzClientType, APIzClientMeta, APIzClientOptions, APIzRequestOptions } from 'apiz-browser-client';
import { VueConstructor as _Vue } from 'vue';

let installed = false;

// interface Options<M extends APIMeta<APIzClientType, APIzClientMeta>> extends APIzOptions<APIzClientInstance> {
// 	meta: M;
// }

type Options = APIzOptions<APIzRequestOptions, APIzClientInstance> & APIzClientOptions & {
	meta: APIMeta<APIzClientType, APIzClientMeta>;
};

type Instance = APIzInstance<APIzRequestOptions, APIMeta<APIzClientType, APIzClientMeta>, APIzClientType, APIzClientMeta>;

interface NamedInstance {
	name: string;
	apiGroup: Instance;
};

// type APIs = Instance | Array<NamedInstance> | NamedInstance;

function APIs<M extends APIMeta<APIzClientType, APIzClientMeta>>(options: Options): Instance {
	// 这里不用new本来是没关系的, 但是他妈的V8有个bug...
	// 但是受限于TS的类型检查我又不能在这里用new
	// 那就只能在下面修复这个问题了
	return APIz<APIzRequestOptions, APIzClientInstance, APIMeta<APIzClientType, APIzClientMeta>, APIzClientType, APIzClientMeta, HTTPMethodLowerCase>(options.meta, {
		immutableMeta: true,
		// defaultType: 'json',
		client: Client(options),
		...options
	});
}

// function isAnonymous(apis: any): apis is Instance {
// 	return apis instanceof APIz;
// }

// tslint:disable-next-line
APIs.install = function (Vue: _Vue, { pool = 5 }: { pool?: number | boolean } = {}) {
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
		beforeCreate(): void | never {
			// 判断一下$root, 短路求值有利于减少其他组件实例化的判断
			if (this.$root === this && this.$options && (this.$options as any).apis) {
				const apis = (this.$options as any).apis;
				switch (true) {
					// switch true的话类型保护不起作用啊...
					// 看来只能手动as了
					// 本来instanceof是没什么问题的, 但是V8最近的版本有个bug, 这里会得到false
					// 所以换Object.getPrototypeOf
					// case apis instanceof APIz:
					case Object.getPrototypeOf(Object.getPrototypeOf(apis)) === APIz.prototype:
						Vue.prototype.$apis = apis as Instance;
						break;
					case Array.isArray(apis):
						(apis as Array<NamedInstance>).forEach(item => Vue.prototype[item.name] = item.apiGroup);
						break;
					case typeof apis.name === 'string' && apis.apiGroup instanceof APIz:
						Vue.prototype[apis.name] = apis.apiGroup as Instance;
						break;
					default:
						throw new TypeError('apis must be an Object or an Array');
				}
			}
		}
	});
};

if (window && (window as any).Vue) {
	(window as any).Vue.use(APIs);
}

export default APIs;