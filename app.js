document.addEventListener('DOMContentLoaded', () => {
  const topbarContainer = document.getElementById('topbar-container');

  if (topbarContainer) {
    fetch('topbar.html')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Nepodarilo sa načítať navigáciu (${response.status}).`);
        }
        return response.text();
      })
      .then((markup) => {
        topbarContainer.innerHTML = markup;
        const page = document.body.dataset.page;
        const activeLink = topbarContainer.querySelector(`[data-nav="${page}"]`);
        if (activeLink) {
          activeLink.setAttribute('aria-current', 'page');
        }
      })
      .catch((error) => {
        console.error('Chyba pri načítaní navigácie:', error);
        topbarContainer.textContent = 'Navigáciu sa nepodarilo načítať. Spustite stránku cez lokálny webový server.';
        topbarContainer.classList.add('load-error');
      });
  }

  const greetingButton = document.getElementById('greeting-button');
  if (greetingButton) {
    greetingButton.addEventListener('click', () => {
      const nameField = document.getElementById('visitor-name');
      const output = document.getElementById('greeting-output');
      const name = nameField.value.trim();
      output.textContent = name ? `Ahoj, ${name}! Vitaj na mojej stránke.` : 'Najskôr zadaj svoje meno.';
    });
  }

  const dateOutput = document.getElementById('today-output');
  if (dateOutput) {
    dateOutput.textContent = new Intl.DateTimeFormat('sk-SK', { dateStyle: 'long' }).format(new Date());
  }
});
