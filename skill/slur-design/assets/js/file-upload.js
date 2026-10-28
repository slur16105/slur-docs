(function () {
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const fileKey = (file) => `${file.name}:${file.size}:${file.lastModified}`;

  document.querySelectorAll('.file_upload').forEach((upload) => {
    const input = upload.querySelector('.i_input');
    const drop = upload.querySelector('.i_drop');
    const list = upload.querySelector('.i_list');
    const help = upload.querySelector('.i_help');
    if (!input || !drop || !list || !help) return;
    const defaultHelp = help.textContent;
    let files = [];

    const syncInput = () => {
      if (typeof DataTransfer === 'undefined') return;
      const transfer = new DataTransfer();
      files.forEach((file) => transfer.items.add(file));
      input.files = transfer.files;
    };

    const render = () => {
      list.replaceChildren();
      files.forEach((file, index) => {
        const item = document.createElement('li');
        item.className = 'i_item';

        const info = document.createElement('span');
        info.className = 'i_file';
        const name = document.createElement('span');
        name.className = 'i_name';
        name.textContent = file.name;
        const meta = document.createElement('span');
        meta.className = 'i_meta';
        meta.textContent = `${formatSize(file.size)} · ${file.type || '파일'}`;
        info.append(name, meta);

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'i_remove';
        remove.dataset.fileRemove = String(index);
        remove.setAttribute('aria-label', `${file.name} 삭제`);
        remove.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg>';
        item.append(info, remove);
        list.append(item);
      });
      upload.dataset.state = files.length ? 'filled' : 'idle';
      help.textContent = files.length ? `${files.length}개 파일이 선택되었습니다.` : defaultHelp;
    };

    const addFiles = (incoming) => {
      const next = input.multiple ? [...files] : [];
      const keys = new Set(next.map(fileKey));
      [...incoming].forEach((file) => {
        const key = fileKey(file);
        if (!keys.has(key) && (input.multiple || next.length === 0)) {
          next.push(file);
          keys.add(key);
        }
      });
      files = next;
      syncInput();
      render();
      input.dispatchEvent(new CustomEvent('slur:filechange', { bubbles: true, detail: { files: [...files] } }));
    };

    input.addEventListener('change', () => {
      files = [];
      addFiles(input.files);
    });
    drop.addEventListener('click', () => {
      if (!input.disabled) input.click();
    });
    drop.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      if (!input.disabled) input.click();
    });
    ['dragenter', 'dragover'].forEach((name) => drop.addEventListener(name, (event) => {
      event.preventDefault();
      if (!input.disabled) upload.dataset.state = 'dragover';
    }));
    ['dragleave', 'dragend'].forEach((name) => drop.addEventListener(name, () => {
      upload.dataset.state = files.length ? 'filled' : 'idle';
    }));
    drop.addEventListener('drop', (event) => {
      event.preventDefault();
      if (!input.disabled && event.dataTransfer?.files.length) addFiles(event.dataTransfer.files);
    });
    list.addEventListener('click', (event) => {
      const remove = event.target.closest('[data-file-remove]');
      if (!remove || input.disabled) return;
      files.splice(Number(remove.dataset.fileRemove), 1);
      syncInput();
      render();
      input.dispatchEvent(new CustomEvent('slur:filechange', { bubbles: true, detail: { files: [...files] } }));
      drop.focus();
    });
    input.form?.addEventListener('reset', () => { setTimeout(() => { files = [...input.files]; render(); }, 0); });
    files = [...input.files];
    render();
  });
})();
