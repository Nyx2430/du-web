document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('book-form');
  const bookList = document.getElementById('book-list');
  const status = document.getElementById('book-status');

  const showError = async (response) => {
    const detail = await response.text();
    throw new Error(detail || `Požiadavka zlyhala (${response.status}).`);
  };

  const sendJson = async (url, method, body) => {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!response.ok) await showError(response);
  };

  const makeButton = (text, onClick) => {
    const button = document.createElement('button');
    button.className = 'demo-button';
    button.type = 'button';
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
  };

  // Okno s nastaveniami knihy
  const dialog = document.createElement('dialog');
  dialog.style.cssText = 'border:none;border-radius:16px;padding:24px;max-width:420px;width:90%;box-shadow:0 10px 40px rgba(0,0,0,.25)';
  dialog.innerHTML = `
    <form method="dialog" class="demo-form" id="settings-form">
      <h2>Nastavenia knihy</h2>
      <div class="field-group"><label for="set-title">Názov</label><input id="set-title" type="text" required></div>
      <div class="field-group"><label for="set-author">Autor</label><input id="set-author" type="text" required></div>
      <div class="field-group"><label for="set-price">Cena (€)</label><input id="set-price" type="number" min="0" step="0.01" required></div>
      <p class="demo-output" id="settings-status" role="status"></p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button type="submit" id="set-save">Uložiť</button>
        <button type="button" class="demo-button" id="set-delete">Odstrániť zo zoznamu</button>
        <button type="button" class="demo-button" id="set-cancel">Zavrieť</button>
      </div>
    </form>`;
  document.body.appendChild(dialog);

  const settingsForm = dialog.querySelector('#settings-form');
  const titleInput = dialog.querySelector('#set-title');
  const authorInput = dialog.querySelector('#set-author');
  const priceInput = dialog.querySelector('#set-price');
  const settingsStatus = dialog.querySelector('#settings-status');
  let currentBook = null;

  const openSettings = (book) => {
    currentBook = book;
    titleInput.value = book.nazov;
    authorInput.value = book.autor;
    priceInput.value = book.cena;
    settingsStatus.textContent = '';
    dialog.showModal();
  };

  dialog.querySelector('#set-cancel').addEventListener('click', () => dialog.close());

  settingsForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const nazov = titleInput.value.trim();
    const autor = authorInput.value.trim();
    const cena = Number(priceInput.value);
    if (!nazov || !autor || !Number.isFinite(cena) || cena < 0) {
      settingsStatus.textContent = 'Skontroluj názov, autora a cenu.';
      return;
    }
    try {
      const id = encodeURIComponent(currentBook.id);
      await sendJson(`/api/knihi/${id}`, 'PUT', { nazov, autor, rok: Number(currentBook.rok) });
      await sendJson(`/api/knihi/${id}/cena`, 'PATCH', { cena });
      dialog.close();
      await loadBooks();
      status.textContent = 'Zmeny boli uložené.';
    } catch (error) {
      settingsStatus.textContent = `Nepodarilo sa uložiť: ${error.message}`;
    }
  });

  dialog.querySelector('#set-delete').addEventListener('click', async () => {
    try {
      await sendJson(`/api/knihi/${encodeURIComponent(currentBook.id)}`, 'DELETE');
      dialog.close();
      await loadBooks();
    } catch (error) {
      settingsStatus.textContent = `Nepodarilo sa odstrániť: ${error.message}`;
    }
  });

  const loadBooks = async () => {
    status.textContent = 'Načítavam knihy…';
    try {
      const response = await fetch('/api/knihi');
      if (!response.ok) await showError(response);
      const books = await response.json();
      bookList.replaceChildren();

      books.forEach((book) => {
        const row = document.createElement('tr');
        [book.nazov, book.autor, book.rok, book.cena].forEach((value) => {
          const cell = document.createElement('td');
          cell.textContent = value ?? '';
          row.appendChild(cell);
        });

        const actionCell = document.createElement('td');

        if (book.vymazana) {
          row.style.opacity = '0.5';
          row.style.textDecoration = 'line-through';
          const restoreButton = makeButton('Vrátiť späť', async () => {
            try {
              await sendJson(`/api/knihi/${encodeURIComponent(book.id)}/obnovit`, 'PATCH');
              await loadBooks();
            } catch (error) {
              status.textContent = `Knihu sa nepodarilo vrátiť: ${error.message}`;
            }
          });
          restoreButton.style.textDecoration = 'none';
          actionCell.appendChild(restoreButton);
        } else {
          actionCell.appendChild(makeButton('⚙ Nastavenia', () => openSettings(book)));
        }

        const purgeButton = makeButton('🗑 Vymazať', async () => {
          if (!window.confirm(`Naozaj natrvalo vymazať knihu „${book.nazov}“? Túto akciu nie je možné vrátiť.`)) return;
          try {
            await sendJson(`/api/knihi/${encodeURIComponent(book.id)}/natrvalo`, 'DELETE');
            await loadBooks();
            status.textContent = 'Kniha bola natrvalo vymazaná.';
          } catch (error) {
            status.textContent = `Knihu sa nepodarilo vymazať: ${error.message}`;
          }
        });
        purgeButton.style.textDecoration = 'none';
        purgeButton.style.marginLeft = '14px';
        actionCell.appendChild(purgeButton);

        row.appendChild(actionCell);
        bookList.appendChild(row);
      });

      status.textContent = books.length ? '' : 'V knižnici zatiaľ nie sú žiadne knihy.';
    } catch (error) {
      status.textContent = `Knihy sa nepodarilo načítať: ${error.message}`;
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const book = {
      nazov: formData.get('nazov').trim(),
      autor: formData.get('autor').trim(),
      rok: Number(formData.get('rok')),
      cena: Number(document.getElementById('cena').value)
    };

    try {
      await sendJson('/api/knihi', 'POST', book);
      form.reset();
      await loadBooks();
      status.textContent = 'Kniha bola pridaná.';
    } catch (error) {
      status.textContent = `Knihu sa nepodarilo pridať: ${error.message}`;
    }
  });

  loadBooks();
});
