(function () {
  const focusableSelector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

  document.querySelectorAll('.combobox').forEach((box) => {
    const input = box.querySelector('.i_input');
    const button = box.querySelector('.i_button');
    const list = box.querySelector('[role="listbox"]');
    const options = [...box.querySelectorAll('[role="option"]')];
    const empty = box.querySelector('.i_empty');
    if (!input || !button || !list || !empty) return;
    let activeIndex = -1;

    const visibleOptions = () => options.filter((option) => !option.hidden);
    const clearActive = () => {
      activeIndex = -1;
      input.removeAttribute('aria-activedescendant');
      options.forEach((option) => { option.dataset.state = ''; });
    };
    const setActive = (index) => {
      const visible = visibleOptions();
      if (!visible.length) {
        clearActive();
        return;
      }
      activeIndex = (index + visible.length) % visible.length;
      options.forEach((option) => { option.dataset.state = ''; });
      const active = visible[activeIndex];
      active.dataset.state = 'active';
      input.setAttribute('aria-activedescendant', active.id);
      active.scrollIntoView({ block: 'nearest' });
    };
    const open = () => {
      if (input.disabled) return;
      box.dataset.state = 'open';
      input.setAttribute('aria-expanded', 'true');
      list.hidden = false;
    };
    const close = () => {
      box.dataset.state = 'close';
      input.setAttribute('aria-expanded', 'false');
      list.hidden = true;
      clearActive();
    };
    const select = (option) => {
      options.forEach((item) => item.setAttribute('aria-selected', String(item === option)));
      input.value = option.textContent.trim();
      close();
      input.dispatchEvent(new CustomEvent('slur:comboboxchange', { bubbles: true, detail: { value: option.dataset.value || option.textContent.trim() } }));
      input.focus();
    };
    const filter = () => {
      const query = input.value.trim().toLocaleLowerCase('ko');
      options.forEach((option) => { option.hidden = !option.textContent.toLocaleLowerCase('ko').includes(query); });
      empty.hidden = visibleOptions().length > 0;
      clearActive();
      open();
    };

    box.addEventListener('focusout', (event) => { if (!box.contains(event.relatedTarget)) close(); });
    input.addEventListener('input', filter);
    input.addEventListener('focus', open);
    input.addEventListener('keydown', (event) => {
      if (event.isComposing) return;
      if (event.key === 'ArrowDown') { event.preventDefault(); open(); setActive(activeIndex < 0 ? 0 : activeIndex + 1); }
      if (event.key === 'ArrowUp') { event.preventDefault(); open(); setActive(activeIndex < 0 ? visibleOptions().length - 1 : activeIndex - 1); }
      if (event.key === 'Home' && box.dataset.state === 'open') { event.preventDefault(); setActive(0); }
      if (event.key === 'End' && box.dataset.state === 'open') { event.preventDefault(); setActive(visibleOptions().length - 1); }
      if (event.key === 'Enter' && box.dataset.state === 'open') {
        const option = visibleOptions()[activeIndex];
        if (option) { event.preventDefault(); select(option); }
      }
      if (event.key === 'Escape') { event.preventDefault(); close(); }
    });
    button.addEventListener('click', () => {
      if (box.dataset.state === 'open') close();
      else { open(); input.focus(); }
    });
    list.addEventListener('mousedown', (event) => event.preventDefault());
    list.addEventListener('pointermove', (event) => {
      const option = event.target.closest('[role="option"]');
      if (!option || option.hidden) return;
      const index = visibleOptions().indexOf(option);
      if (index >= 0 && index !== activeIndex) setActive(index);
    });
    list.addEventListener('click', (event) => {
      const option = event.target.closest('[role="option"]');
      if (option) select(option);
    });
    document.addEventListener('click', (event) => { if (!box.contains(event.target)) close(); });
    close();
  });

  document.querySelectorAll('.range_slider').forEach((slider) => {
    const input = slider.querySelector('.i_control');
    const output = slider.querySelector('.i_value');
    if (!input || !output) return;
    const suffix = output.dataset.suffix || '';
    const update = () => { output.value = `${input.value}${suffix}`; output.textContent = `${input.value}${suffix}`; };
    input.addEventListener('input', update);
    update();
  });

  // Native dialog owns background inert, focus containment and focus restoration.
  const timers = new WeakMap();
  const closeOverlay = (overlay) => {
    if (!overlay?.open || overlay.dataset.state === 'closing') return;
    overlay.dataset.state = 'closing';
    const finish = () => {
      clearTimeout(timers.get(overlay));
      timers.delete(overlay);
      overlay.close();
      overlay.dataset.state = 'close';
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    else timers.set(overlay, setTimeout(finish, 200));
  };
  document.querySelectorAll('dialog.drawer_panel').forEach((overlay) => {
    overlay.addEventListener('cancel', (event) => { event.preventDefault(); closeOverlay(overlay); });
    overlay.addEventListener('close', () => {
      clearTimeout(timers.get(overlay));
      overlay.dataset.state = 'close';
    });
  });
  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-overlay-open]');
    if (opener) {
      const overlay = document.getElementById(opener.dataset.overlayOpen);
      if (!(overlay instanceof HTMLDialogElement) || overlay.open) return;
      overlay.showModal();
      overlay.getBoundingClientRect(); // Establish the offscreen state before the entrance transition.
      overlay.dataset.state = 'open';
      overlay.querySelector('.i_panel ' + focusableSelector.split(', ').join(', .i_panel '))?.focus();
    }
    const closer = event.target.closest('[data-overlay-close]');
    if (closer) closeOverlay(closer.closest('dialog.drawer_panel'));
  });
  document.querySelectorAll('.avatar').forEach((avatar) => {
    const img = avatar.querySelector('.i_image');
    const fallback = avatar.querySelector('.i_fallback');
    if (!img || !fallback) return;
    const update = () => { const valid = img.complete && img.naturalWidth > 0; img.hidden = !valid; fallback.hidden = valid; };
    img.addEventListener('load', update);
    img.addEventListener('error', update);
    update();
  });
})();
