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
        activeEffect = this;
        this._fn();
        activeEffect = undefined;
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
    if (!activeEffect) return;
    // console.log(`触发 track -> target: ${target} type:${type} key:${key}`);
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
    }
};

const triggerEffects = (effects: Set<ReactiveEffect>) => {
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