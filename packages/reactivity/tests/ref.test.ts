import { describe, it, expect, vi } from "vitest";
import { ref, effect, isRef, unref, reactive, isReactive, proxyRefs } from '@mini-vue3/reactivity';

describe('ref', () => { 
    it('should hold a value', () => {
        const a = ref(1);
        expect(a.value).toBe(1);
        a.value++;
        expect(a.value).toBe(2);
    });

    it('should be reactive', () => {
        const a = ref(1);
        let dummy;
        const fn = vi.fn(() => {
            dummy = a.value;
        });
        effect(fn);
        expect(dummy).toBe(1);
        expect(fn).toHaveBeenCalledTimes(1);
        a.value++;
        expect(fn).toHaveBeenCalledTimes(2);
        expect(dummy).toBe(2);
        // same value should not trigger
        a.value = 2;
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should make nested values reactive', () => {
        const a = ref({
            count: 1,
        });
        let dummy;
        effect(() => {
            dummy = a.value.count;
        });
        expect(dummy).toBe(1);
        a.value.count++;
        expect(dummy).toBe(2);
        expect(isReactive(a.value)).toBe(true);
    });

    it('should work without initial value', () => {
        const a = ref();
        let dummy;
        effect(() => {
            dummy = a.value;
        });
        expect(dummy).toBe(undefined);
        a.value = 2;
        expect(dummy).toBe(2);
    });

    it('proxyRefs', () => {
        const a = ref(1);
        const b = ref(2);
        const obj = proxyRefs({ a, b });
        expect(obj.a).toBe(1);
        expect(obj.b).toBe(2);
        obj.a++;
        expect(obj.a).toBe(2);
        expect(a.value).toBe(2);
        obj.b++;
        expect(obj.b).toBe(3);
        expect(b.value).toBe(3);
    });

    it('isRef', () => {
        const a = ref(1);
        const user = reactive({});
        expect(isRef(a)).toBe(true);
        expect(isRef(1)).toBe(false);
        expect(isRef(user)).toBe(false);
    });

    it('unref', () => {
        const a = ref(1);
        expect(unref(a)).toBe(1);
        expect(unref(1)).toBe(1);
    });
});
