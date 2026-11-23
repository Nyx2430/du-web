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

  const openSettings = (kniha) => {
    currentBook = kniha;
    titleInput.value = kniha.nazov;
    authorInput.value = kniha.autor;
    priceInput.value = kniha.cena;
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
      // PUT: úprava názvu a autora knihy
      const putResponse = await fetch(`/api/knihy/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nazov, autor, rok: Number(currentBook.rok) })
      });
      if (!putResponse.ok) await showError(putResponse);

      // PATCH: zmena ceny knihy. Server k cene pripocita "zmena",
      // preto z novej ceny vypocitame rozdiel oproti sucasnej cene.
      const zmena = Math.round((cena - Number(currentBook.cena)) * 100) / 100;
      if (zmena !== 0) {
        const patchResponse = await fetch(`/api/knihy/${id}/cena`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ zmena })
        });
        if (!patchResponse.ok) await showError(patchResponse);
      }
      dialog.close();
      await nacitajKnihy();
      status.textContent = 'Zmeny boli uložené.';
    } catch (error) {
      settingsStatus.textContent = `Nepodarilo sa uložiť: ${error.message}`;
    }
  });

  dialog.querySelector('#set-delete').addEventListener('click', async () => {
    try {
      await sendJson(`/api/knihy/${encodeURIComponent(currentBook.id)}`, 'DELETE');
      dialog.close();
      await nacitajKnihy();
    } catch (error) {
      settingsStatus.textContent = `Nepodarilo sa odstrániť: ${error.message}`;
    }
  });

  const nacitajKnihy = async () => {
    status.textContent = 'Načítavam knihy…';
    try {
      const hladat = document.getElementById('hladatInput').value;
      const zoradit = document.getElementById('zoraditSelect').value;
      const smer = document.getElementById('smerSelect').value;
      const params = new URLSearchParams({ hladat, zoradit, smer });

      const response = await fetch('/api/knihy?' + params.toString());
      if (!response.ok) await showError(response);
      const books = await response.json();
      bookList.replaceChildren();

      books.forEach((kniha) => {
        const row = document.createElement('tr');
        [kniha.nazov, kniha.autor, kniha.rok, kniha.cena].forEach((value) => {
          const cell = document.createElement('td');
          cell.textContent = value ?? '';
          row.appendChild(cell);
        });

        const actionCell = document.createElement('td');

        if (kniha.vymazana) {
          row.style.opacity = '0.5';
          row.style.textDecoration = 'line-through';
          const restoreButton = makeButton('Vrátiť späť', async () => {
            try {
              await sendJson(`/api/knihy/${encodeURIComponent(kniha.id)}/obnovit`, 'PATCH');
              await nacitajKnihy();
            } catch (error) {
              status.textContent = `Knihu sa nepodarilo vrátiť: ${error.message}`;
            }
          });
          restoreButton.style.textDecoration = 'none';
          actionCell.appendChild(restoreButton);
        } else {
          actionCell.appendChild(makeButton('⚙ Nastavenia', () => openSettings(kniha)));
        }

        const purgeButton = makeButton('🗑 Vymazať', async () => {
          if (!window.confirm(`Naozaj natrvalo vymazať knihu „${kniha.nazov}“? Túto akciu nie je možné vrátiť.`)) return;
          try {
            await sendJson(`/api/knihy/${encodeURIComponent(kniha.id)}/natrvalo`, 'DELETE');
            await nacitajKnihy();
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
    const kniha = {
      nazov: formData.get('nazov').trim(),
      autor: formData.get('autor').trim(),
      rok: Number(formData.get('rok')),
      cena: Number(document.getElementById('cena').value)
    };

    try {
      const response = await fetch('/api/knihy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kniha)
      });
      if (!response.ok) await showError(response);
      form.reset();
      await nacitajKnihy();
      status.textContent = 'Kniha bola pridaná.';
    } catch (error) {
      status.textContent = `Knihu sa nepodarilo pridať: ${error.message}`;
    }
  });

  // Reakcia na zmenu filtra alebo zoradenia
  document.getElementById('hladatInput').addEventListener('input', nacitajKnihy);
  document.getElementById('zoraditSelect').addEventListener('change', nacitajKnihy);
  document.getElementById('smerSelect').addEventListener('change', nacitajKnihy);

  document.getElementById('resetFilterBtn').addEventListener('click', () => {
    document.getElementById('hladatInput').value = '';
    document.getElementById('zoraditSelect').value = 'id';
    document.getElementById('smerSelect').value = 'ASC';
    nacitajKnihy();
  });

  // Bonus: meno prihláseného používateľa zo sessionStorage
  const prihlasenyInfo = document.getElementById('prihlaseny-info');
  if (prihlasenyInfo) {
    let pouzivatel = null;
    try {
      pouzivatel = JSON.parse(sessionStorage.getItem('prihlasenyPouzivatel'));
    } catch (error) {
      pouzivatel = null;
    }
    if (pouzivatel && pouzivatel.meno) {
      prihlasenyInfo.textContent = `Prihlásený používateľ: ${pouzivatel.meno}`;
    } else {
      prihlasenyInfo.append('Nie ste prihlásený. ');
      const link = document.createElement('a');
      link.href = 'prihlasenie.html';
      link.textContent = 'Prihlásiť sa';
      prihlasenyInfo.appendChild(link);
    }
  }

  nacitajKnihy();
});
