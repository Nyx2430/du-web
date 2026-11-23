const prihlasenieForm = document.getElementById('prihlasenieForm');
const vysledokEl = document.getElementById('vysledok');

function zobrazStavPrihlasenia() {
  const ulozeny = sessionStorage.getItem('prihlasenyPouzivatel');
  if (!ulozeny) return;

  const pouzivatel = JSON.parse(ulozeny);
  vysledokEl.innerHTML = '';

  const info = document.createElement('p');
  info.style.color = 'green';
  info.textContent = `Prihlásený používateľ: ${pouzivatel.meno} (${pouzivatel.email})`;

  const odhlasitBtn = document.createElement('button');
  odhlasitBtn.className = 'demo-button';
  odhlasitBtn.type = 'button';
  odhlasitBtn.textContent = 'Odhlásiť sa';
  odhlasitBtn.onclick = () => {
    sessionStorage.removeItem('prihlasenyPouzivatel');
    vysledokEl.innerHTML = '<p>Boli ste odhlásený.</p>';
  };

  vysledokEl.appendChild(info);
  vysledokEl.appendChild(odhlasitBtn);
}

prihlasenieForm.addEventListener('submit', async event => {
  event.preventDefault();

  const udaje = {
    email: document.getElementById('email').value,
    heslo: document.getElementById('heslo').value
  };

  const odpoved = await fetch('/api/prihlasenie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(udaje)
  });

  const data = await odpoved.json();

  if (!odpoved.ok) {
    vysledokEl.innerHTML = '';
    const chyba = document.createElement('p');
    chyba.style.color = 'red';
    chyba.textContent = data.sprava;
    vysledokEl.appendChild(chyba);
    return;
  }

  sessionStorage.setItem('prihlasenyPouzivatel', JSON.stringify(data.pouzivatel));

  prihlasenieForm.reset();
  zobrazStavPrihlasenia();
});

zobrazStavPrihlasenia();
