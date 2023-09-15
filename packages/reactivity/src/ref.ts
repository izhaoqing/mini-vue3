import { isObject, hasChanged } from '@mini-vue3/shared';
import { reactive, isReactive } from './reactive';
import { createDep } from './dep';
import { trackEffect, triggerEffects, isTracking } from './effect';

export class RefImpl {
    public __v_isRef = true;
    private _rawValue: any;
    private _value: any;
    public dep: Set<any>;
    constructor(value) {
        this._rawValue = value;
        this._value = convert(value);
        this.dep = createDep();
    }

    get value() {
        trackRefValue(this.dep);
        return this._value;
    }

    set value(newValue) {
        if (hasChanged(newValue, this._rawValue)) {
            this._rawValue = newValue;
            this._value = convert(newValue);
            triggerEffects(this.dep);
        }
    }
}

const convert = (val) => isObject(val) ? reactive(val) : val;

const trackRefValue = (dep) => {
    if (isTracking()) {
        trackEffect(dep);
    }
};

export const ref = (value?) => new RefImpl(value);

export const isRef = (value) => {
    return !!value?.__v_isRef;
};

export const unref = (value) => {
    return isRef(value) ? value.value : value;
};

// 在 template 中可以直接使用 ref 类型的数据，不需要 .value，
// 这是把 setup 返回的数据做了代理，如果是 ref 类型的数据，就直接返回 value
// 不过只做了一层代理，更深层的属性需要 .value
// https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#caveat-when-unwrapping-in-templates
export const proxyRefs = (objectWidthRefs) => {
    if (isReactive(objectWidthRefs)) return objectWidthRefs;
    return new Proxy(objectWidthRefs, {
        get(target, key) {
            return unref(Reflect.get(target, key));
        },
        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                target[key].value = value;
                return true;
            } else {
                return Reflect.set(target, key, value);
            }
        },
    });
};
