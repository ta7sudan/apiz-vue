# @lowb/apiz-vue
A vue plugin for apiz



## Installation

```shell
$ npm i -P @lowb/apiz-vue
```



## Usage

```javascript
import APIs from '@lowb/apiz-vue';
import Vue from 'vue';

Vue.use(APIs);

const apis = new APIs({
    meta: {
        getBooks: {
            path: '/book'
        }
    },
    retry: 1,
    beforeSend() {},
    afterResponse() {}
});

new Vue({
    apis
});
// or
new Vue({
    apis: {
        name: '$http',
        apiGroup: apis
    }
});
// or
new Vue({
    apis: [{
        name: '$group0',
        apiGroup: apis
    }, {
        name: '$group1',
        apiGroup: apis
    }]
});
```



## Options

* `meta` meta of [APIz](https://github.com/ta7sudan/apiz-ng#apizmeta-apimeta-options-groupoptions)
* All other option of [apiz-ng](https://github.com/ta7sudan/apiz-ng) are supported
* All options of [apiz-browser-client](https://github.com/ta7sudan/apiz-browser-client) are supported