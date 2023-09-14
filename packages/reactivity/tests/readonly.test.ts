import { describe, it, expect } from 'vitest';
import { readonly, isReadonly, shallowReadonly } from '@mini-vue3/reactivity';

describe('readonly', () => {
    it('should make nested values readonly', () => {
        const original = {
            foo: 1,
            bar: {
                baz: 2,
            },
            arr: [{ qux: 3 }],
        };
        const wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(isReadonly(wrapped)).toBe(true);
        expect(isReadonly(original)).toBe(false);
        expect(isReadonly(wrapped.bar)).toBe(true);
        expect(isReadonly(wrapped.arr)).toBe(true);
        expect(isReadonly(wrapped.arr[0])).toBe(true);
    });

    it('should not allow mutation', () => {
        const user = readonly({
            age: 10,
        });
        user.age++;
        expect(user.age).toBe(10);
    });

    it('shallow readonly', () => {
        const original = {
            foo: 1,
            bar: {
                baz: 2,
            },
        };
        const wrapped = shallowReadonly(original);
        expect(isReadonly(wrapped)).toBe(true);
        expect(isReadonly(original)).toBe(false);
        expect(isReadonly(wrapped.foo)).toBe(false);
        expect(isReadonly(original.foo)).toBe(false);
        expect(isReadonly(wrapped.bar.baz)).toBe(false);
        wrapped.foo++;
        expect(wrapped.foo).toBe(1);
        wrapped.bar.baz++;
        expect(wrapped.bar.baz).toBe(3);
    });
});
