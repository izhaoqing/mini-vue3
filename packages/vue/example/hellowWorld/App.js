import { effect, reactive } from '../../dist/mini-vue.esm-bundler.js';

const counter = reactive({ nested: { num: 0 } });
console.log(counter.nested.num);