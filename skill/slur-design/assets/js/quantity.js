(() => {
    'use strict';
    document.querySelectorAll('[data-js~="quantity"]').forEach((quantity) => {
        const input = quantity.querySelector('[data-js~="quantity-input"]');
        const minus = quantity.querySelector('[data-js~="quantity-minus"]');
        const plus = quantity.querySelector('[data-js~="quantity-plus"]');
        const result = quantity.querySelector('[data-js~="quantity-result"]');
        const min = Number(input.min);
        const max = Number(input.max);
        function sync() {
            const value = input.valueAsNumber;
            minus.disabled = input.disabled || input.readOnly || (Number.isFinite(value) && value <= min);
            plus.disabled = input.disabled || input.readOnly || (Number.isFinite(value) && value >= max);
        }
        function normalize() {
            const value = input.valueAsNumber;
            input.value = Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : min;
            sync();
            if (result) {
                result.textContent = `선택 수량 ${input.value}개`;
            }
        }
        function change(amount) {
            normalize();
            input.value = Math.min(max, Math.max(min, input.valueAsNumber + amount));
            input.dispatchEvent(new Event('input', {bubbles: true}));
            input.dispatchEvent(new Event('change', {bubbles: true}));
        }
        minus.addEventListener('click', () => change(-1));
        plus.addEventListener('click', () => change(1));
        input.addEventListener('input', sync);
        input.addEventListener('change', normalize);
        input.addEventListener('blur', normalize);
        if (input.form) {
            input.form.addEventListener('reset', () => {
                queueMicrotask(normalize);
            });
        }
        normalize();
    });
})();
