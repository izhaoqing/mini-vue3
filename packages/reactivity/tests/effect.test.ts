import { describe, it, expect, vi } from 'vitest';
import { effect, reactive } from '@mini-vue3/reactivity';

describe('effect', () => {
    it('should run the passed function once (wrapped by a effect)', () => {
        const fnSpy = vi.fn(() => {});
        effect(fnSpy);
        expect(fnSpy).toHaveBeenCalledTimes(1);
    });

    it('should observe basic properties', () => {
        const user = reactive({
            age: 10, 
        });
        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        });
        expect(nextAge).toBe(11);
        user.age++;
        expect(nextAge).toBe(12);
    });

    it('should observe multiple properties', () => {
        const counter = reactive({
            num1: 0,
            num2: 1,
        });
        let num;
        effect(() => {
            num = counter.num1 + counter.num2;
        });
        expect(num).toBe(1);
        counter.num1 = counter.num2 = 3;
        expect(num).toBe(6);
    });

    it('should handle multiple effects', () => {
        let dummy1, dummy2;
        const counter = reactive({ num: 0 });
        effect(() => (dummy1 = counter.num));
        effect(() => (dummy2 = counter.num));
        expect(dummy1).toBe(0);
        expect(dummy2).toBe(0);
        counter.num++;
        expect(dummy1).toBe(1);
        expect(dummy2).toBe(1);
    });

    it('should observe nested properties', () => {
        const counter = reactive({
            nested: {
                num: 0,
            },
        });
        let dummy;
        effect(() => (dummy = counter.nested.num));
        expect(dummy).toBe(0);
        counter.nested.num = 8;
        expect(dummy).toBe(8);
    });

    it('should observe function call chains', () => {
        const counter = reactive({
            num: 0,
        });
        let dummy;
        effect(() => (dummy = getNum()));
        function getNum() {
            return counter.num;
        }
        expect(dummy).toBe(0);
        counter.num = 2;
        expect(dummy).toBe(2);
    });

    it('scheduler', () => {
        let dummy;
        const scheduler = vi.fn();
        const counter = reactive({
            num: 0,
        });
        effect(
            () => {
                dummy = counter.num;
            },
            { scheduler },
        );
        expect(scheduler).toBeCalledTimes(0);
        expect(dummy).toBe(0);
        counter.num++;
        expect(scheduler).toBeCalledTimes(1);
        expect(dummy).toBe(0);
    });

    it('stop', () => {
        let dummy;
        const counter = reactive({
            num: 0,
        });
        const runner = effect(() => {
            dummy = counter.num;
        });
        expect(dummy).toBe(0);
        counter.num++;
        expect(dummy).toBe(1);
        runner.effect.stop();
        counter.num++;
        expect(dummy).toBe(1);
    });

    it('events: onStop', () => {
        const onStop = vi.fn();
        const runner = effect(() => {}, {
            onStop,
        });
        runner.effect.stop();
        expect(onStop).toBeCalledTimes(1);
    });
});