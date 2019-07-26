import { APIzOptions, APIzInstance, HTTPMethodLowerCase, APIGroup, APIInfo } from 'apiz-ng';
import { APIzRawRequestOptions, APIzClientType, APIzClientMeta, APIzClientConstructorOptions } from 'apiz-browser-client';
import { VueConstructor as _Vue } from 'vue';
declare type Options = APIzOptions<APIzRawRequestOptions, APIzClientType, APIzClientMeta, HTTPMethodLowerCase> & APIzClientConstructorOptions & {
    meta: APIGroup<Record<string, APIInfo<APIzClientType, APIzClientMeta>>>;
};
declare type Instance = APIzInstance<APIzRawRequestOptions, Record<string, APIInfo<APIzClientType, APIzClientMeta>>, HTTPMethodLowerCase>;
declare function APIs(options: Options): Instance;
declare namespace APIs {
    var install: (Vue: _Vue<import("vue").default>, { pool }?: {
        pool?: number | boolean | undefined;
    }) => void;
}
export default APIs;
//# sourceMappingURL=index.d.ts.map