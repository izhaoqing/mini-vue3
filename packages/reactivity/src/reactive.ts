import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers';

export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
    RAW = "__v_raw",
  }

const reactiveMap = new WeakMap();
export const reactive = (target: object) => {
    return createReactiveObject(target, reactiveMap, mutableHandlers);
};

const readonlyMap = new WeakMap();
export const readonly = (target: object) => {
    return createReactiveObject(target, readonlyMap, readonlyHandlers);
};

const shallowReadonlyMap = new WeakMap();
export const shallowReadonly = (target: object) => {
    return createReactiveObject(target, shallowReadonlyMap, shallowReadonlyHandlers);
};

function createReactiveObject (target: object, proxyMap: WeakMap<object, any>, baseHandlers: ProxyHandler<any>) {
    if (proxyMap.has(target)) {
        return proxyMap.get(target);
    }
    const proxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
}

export const isReactive = (target: any) => {
    // 如果是 proxy 对象，访问 target.__v_isReactive 会触发 getter，getter 中做判断返回 true
    // 否则返回 undefine
    return !!(target && target[ReactiveFlags.IS_REACTIVE]);
};

export const isReadonly = (target: any) => {
    return !!(target && target[ReactiveFlags.IS_READONLY]);
};
