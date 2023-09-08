import { isObject } from '@mini-vue3/shared';
import { reactive, readonly, ReactiveFlags } from './reactive';
import { track, trigger } from '@mini-vue3/reactivity';

function createGetter (isReadonly = false, shallow = false) {
    return function get (target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        }
        if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }
        const res = Reflect.get(target, key, receiver);
        if (!isReadonly) {
            track(target, "get" /* GET */, key);
        }
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}

function createSetter() {
    return function set (target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver);
        trigger(target, "set" /* SET */, key);
        return result;
    };
}

const get = createGetter();
const set = createSetter();
export const mutableHandlers: ProxyHandler<any> = {
    get,
    set,
};

const readonlyGet = createGetter(true);
export const readonlyHandlers: ProxyHandler<any> = {
    get: readonlyGet,
    set: (target, key) => {
        console.warn(
            `Set operation on key "${String(key)}" failed: target is readonly.`,
            target,
        );
        return true;
    },
};

const shallowReadonlyGet = createGetter(true, true);
export const shallowReadonlyHandlers: ProxyHandler<any> = {
    get: shallowReadonlyGet,
    set: (target, key) => {
        console.warn(
            `Set operation on key "${String(key)}" failed: target is readonly.`,
            target,
        );
        return true;
    },
};
