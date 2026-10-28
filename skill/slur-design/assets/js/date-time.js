(function () {
  const Calendar = window.VanillaCalendarPro?.Calendar;

  const labels = {
    application: '달력',
    navigation: '달력 탐색',
    arrowNext: { month: '다음 달', year: '다음 연도 목록', week: '다음 주' },
    arrowPrev: { month: '이전 달', year: '이전 연도 목록', week: '이전 주' },
    month: '월 선택, 현재 선택한 월:',
    months: '월 목록',
    year: '연도 선택, 현재 선택한 연도:',
    years: '연도 목록',
    week: '요일',
    weekNumber: '연중 주차',
    collapse: '한 주만 보기',
    expand: '한 달 전체 보기',
    dates: '현재 달의 날짜',
    selectingTime: '시간 선택 ',
    inputHour: '시',
    inputMinute: '분',
    rangeHour: '시 선택 슬라이더',
    rangeMinute: '분 선택 슬라이더',
    btnKeeping: '오전·오후 전환, 현재:'
  };

  const emitChange = (input) => input.dispatchEvent(new Event('change', { bubbles: true }));
  const decorate = (self, modifier) => self.context.mainElement.classList.add('slur_calendar', modifier);

  document.querySelectorAll('[data-js="date-picker"]').forEach((dateInput) => {
    if (!Calendar) { dateInput.readOnly = false; dateInput.type = 'date'; return; }
    const datePicker = new Calendar(dateInput, {
      inputMode: true,
      positionToInput: 'auto',
      locale: 'ko-KR',
      firstWeekday: 0,
      selectedDates: dateInput.value ? [dateInput.value] : [],
      enableJumpToSelectedDate: true,
      labels,
      onInit: (self) => decorate(self, 'm_date'),
      onShow: (self) => {
        // Measure after hidden is removed; hidden calendars do not reserve scrollable space.
        const calendar = self.context.mainElement;
        const rect = dateInput.getBoundingClientRect();
        const width = calendar.offsetWidth, height = calendar.offsetHeight;
        const above = rect.bottom + height + 8 > innerHeight && rect.top >= height + 8;
        calendar.dataset.vcPosition = above ? 'top' : 'bottom';
        calendar.style.left = `${scrollX + Math.max(8, Math.min(rect.left, document.documentElement.clientWidth - width - 8))}px`;
        calendar.style.top = `${scrollY + (above ? rect.top - height : rect.bottom)}px`;
      },
      onChangeToInput: (self) => {
        const value = self.context.selectedDates[0];
        if (!value) return;
        dateInput.value = value;
        emitChange(dateInput);
        self.hide();
      }
    });
    datePicker.init();
    window.addEventListener('resize', () => datePicker.hide());
  });

  document.querySelectorAll('.time_picker').forEach((timePicker, pickerIndex) => {
    const timeInput = timePicker.querySelector('input[role="combobox"]');
    const timePopover = timePicker?.querySelector('.i_popover');
    const timeList = timePicker?.querySelector('[role="listbox"]');
    const customHint = timePicker?.querySelector('.i_custom');

    if (!timeInput || !timePopover || !timeList || !customHint) return;

    const pad = (value) => String(value).padStart(2, '0');
    const presetTimes = Array.from({ length: 48 }, (_, index) => `${pad(Math.floor(index / 2))}:${index % 2 ? '30' : '00'}`);
    const normalizeTime = (value) => {
      const match = value.trim().match(/^(\d{1,2}):([0-5]\d)$/);
      if (!match) return null;
      const hour = Number(match[1]);
      const minute = Number(match[2]);
      if (hour > 23) return null;
      return `${pad(hour)}:${pad(minute)}`;
    };

    let activeIndex = -1;
    let lastValidValue = normalizeTime(timeInput.value) || '00:00';

    presetTimes.forEach((time) => {
      const option = document.createElement('li');
      option.className = 'i_option';
      option.id = `slurTime${pickerIndex}-${time.replace(':', '')}`;
      option.dataset.value = time;
      option.dataset.search = `${time.replace(':', '')} ${time.replace(/^0/, '')}`;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', String(time === lastValidValue));
      option.textContent = time;
      timeList.appendChild(option);
    });

    const options = [...timeList.querySelectorAll('[role="option"]')];
    const visibleOptions = () => options.filter((option) => !option.hidden);
    const clearActive = () => {
      activeIndex = -1;
      timeInput.removeAttribute('aria-activedescendant');
      options.forEach((option) => { option.dataset.state = ''; });
    };
    const setActive = (index) => {
      const visible = visibleOptions();
      if (!visible.length) return clearActive();
      activeIndex = (index + visible.length) % visible.length;
      options.forEach((option) => { option.dataset.state = ''; });
      const active = visible[activeIndex];
      active.dataset.state = 'active';
      timeInput.setAttribute('aria-activedescendant', active.id);
      active.scrollIntoView({ block: 'nearest' });
    };
    const syncSelected = (value) => {
      options.forEach((option) => option.setAttribute('aria-selected', String(option.dataset.value === value)));
    };
    const resetList = () => {
      options.forEach((option) => { option.hidden = false; });
      customHint.hidden = true;
    };
    const nearestPreset = () => {
      const value = normalizeTime(timeInput.value);
      if (!value) return null;
      const [hour, minute] = value.split(':').map(Number);
      return options[Math.min(Math.round((hour * 60 + minute) / 30), options.length - 1)];
    };
    const setError = (isError) => {
      timeInput.setAttribute('aria-invalid', String(isError));
      customHint.dataset.state = isError ? 'error' : '';
      customHint.textContent = isError
        ? '00:00–23:59 사이의 올바른 시간을 입력하세요.'
        : '시간을 직접 입력한 뒤 Enter를 누르세요.';
      if (isError) customHint.hidden = false;
    };
    const open = (preserveFilter = false) => {
      if (timeInput.disabled || timeInput.readOnly) return;
      if (!preserveFilter) resetList();
      timePicker.dataset.state = 'open';
      timeInput.setAttribute('aria-expanded', 'true');
      timePopover.hidden = false;
      requestAnimationFrame(() => {
        const selected = visibleOptions().find((option) => option.getAttribute('aria-selected') === 'true');
        (selected || nearestPreset())?.scrollIntoView({ block: 'center' });
      });
    };
    const close = () => {
      timePicker.dataset.state = 'close';
      timeInput.setAttribute('aria-expanded', 'false');
      timePopover.hidden = true;
      clearActive();
    };
    const commitValue = (value) => {
      const previous = lastValidValue;
      timeInput.value = value;
      lastValidValue = value;
      syncSelected(value);
      setError(false);
      customHint.hidden = true;
      close();
      if (value !== previous) emitChange(timeInput);
    };
    const commitTypedValue = (showError = true) => {
      const value = normalizeTime(timeInput.value);
      if (!value) {
        if (showError) setError(true);
        return false;
      }
      commitValue(value);
      return true;
    };
    const filter = () => {
      const query = timeInput.value.trim().replace(':', '').toLocaleLowerCase('ko');
      options.forEach((option) => { option.hidden = query.length > 0 && !option.dataset.search.startsWith(query); });
      clearActive();
      setError(false);
      customHint.hidden = false;
      open(true);
    };

    timeInput.addEventListener('focus', () => open());
    timeInput.addEventListener('input', filter);
    timeInput.addEventListener('keydown', (event) => {
      if (event.isComposing) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        open(true);
        const visible = visibleOptions();
        const selectedIndex = visible.findIndex((option) => option.getAttribute('aria-selected') === 'true');
        setActive(activeIndex < 0 ? Math.max(selectedIndex, 0) : activeIndex + 1);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        open(true);
        const visible = visibleOptions();
        const selectedIndex = visible.findIndex((option) => option.getAttribute('aria-selected') === 'true');
        setActive(activeIndex < 0 ? (selectedIndex >= 0 ? selectedIndex : visible.length - 1) : activeIndex - 1);
      }
      if (event.key === 'Home' && timePicker.dataset.state === 'open') { event.preventDefault(); setActive(0); }
      if (event.key === 'End' && timePicker.dataset.state === 'open') { event.preventDefault(); setActive(visibleOptions().length - 1); }
      if (event.key === 'Enter') {
        event.preventDefault();
        const option = visibleOptions()[activeIndex];
        if (option) commitValue(option.dataset.value);
        else commitTypedValue();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        timeInput.value = lastValidValue;
        setError(false);
        customHint.hidden = true;
        close();
      }
      if (event.key === 'Tab') {
        if (!commitTypedValue(false)) timeInput.value = lastValidValue;
        setError(false);
        customHint.hidden = true;
        close();
      }
    });
    timeList.addEventListener('mousedown', (event) => event.preventDefault());
    timeList.addEventListener('pointermove', (event) => {
      const option = event.target.closest('[role="option"]');
      if (!option || option.hidden) return;
      const index = visibleOptions().indexOf(option);
      if (index >= 0 && index !== activeIndex) setActive(index);
    });
    timeList.addEventListener('click', (event) => {
      const option = event.target.closest('[role="option"]');
      if (option) {
        commitValue(option.dataset.value);
      }
    });
    document.addEventListener('click', (event) => {
      if (!timePicker.contains(event.target)) {
        if (timePicker.dataset.state === 'open' && !commitTypedValue(false)) timeInput.value = lastValidValue;
        setError(false);
        customHint.hidden = true;
        close();
      }
    });
  });
})();
