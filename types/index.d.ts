import { APIzOptions, APIMeta, APIzInstance } from 'apiz-ng';
import { APIzClientInstance, APIzClientType, APIzClientMeta, APIzClientOptions, APIzRequestOptions } from 'apiz-browser-client';
import { VueConstructor as _Vue } from 'vue';
declare type Options = APIzOptions<APIzRequestOptions, APIzClientInstance> & APIzClientOptions & {
    meta: APIMeta<APIzClientType, APIzClientMeta>;
};
declare type Instance = APIzInstance<APIzRequestOptions, APIMeta<APIzClientType, APIzClientMeta>, APIzClientType, APIzClientMeta>;
declare function APIs<M extends APIMeta<APIzClientType, APIzClientMeta>>(options: Options): Instance;
declare namespace APIs {
    var install: (Vue: _Vue<import("vue").default>, { pool }?: {
        pool?: number | boolean | undefined;
    }) => void;
}
export default APIs;
//# sourceMappingURL=index.d.ts.map