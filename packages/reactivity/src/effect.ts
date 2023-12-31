import { extend } from '@mini-vue3/shared';

let activeEffect: ReactiveEffect | undefined;
class ReactiveEffect {
    active = true;
    deps: Array<Set<ReactiveEffect>> = [];
    onStop?: () => void;
    scheduler?: () => void;
    private _fn: (options?: object) => void;
    constructor(fn) {
        this._fn = fn;
    }
    run() {
        if(!this.active) {
            return this._fn();
        }
        activeEffect = this;
        const result = this._fn();
        activeEffect = undefined;
        return result;
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            this.active = false;
            this.onStop?.();
        }
    }
}

const cleanupEffect = (effect: ReactiveEffect) => {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
};

export const effect = (fn: () => void, options = {}) => {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
    extend(_effect, options);
    const runner: any = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
};

export const stop = (runner: any) => {
    runner.effect.stop();
};

const targetMap = new WeakMap<object, Map<string, Set<ReactiveEffect>>>();
export const track = (target: object, type: string, key: string) => {
    if (!isTracking()) return;
    // console.log(`触发 track -> target: ${target} type:${type} key:${key}`);
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    trackEffect(dep);
};

export const triggerEffects = (effects: Set<ReactiveEffect>) => {
    for(const effect of effects) {
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }
    }
};

export const trigger = (target, type, key) => {
    // console.log(`触发 trigger -> target: ${target} type:${type} key:${key} value:${value}`);
    const depsMap = targetMap.get(target);
    const deps = depsMap?.get(key);
    if (deps) {
        triggerEffects(deps);
    }
};

export const isTracking = () => {
    return activeEffect !== undefined;
};

export const trackEffect = (dep) => {
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect?.deps.push(dep);
    }
};