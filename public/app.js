// app.js (ES module)
// Ładuje komponenty i widoki (views/*.html) przez fetch i wstrzykuje do kontenerów.
// Następnie podłącza eventy (top tabs, subtabs, wybór elementów list).

const topNavContainer = document.getElementById('top-nav-container');
const subnavContainer = document.getElementById('subnav-container');
const contentContainer = document.getElementById('content-container');
const invActionsContainer = document.getElementById('inv-actions-container');
const footerContainer = document.getElementById('footer-container');

async function loadHTML(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return await res.text();
}

async function loadComponent(url, targetEl) {
  const html = await loadHTML(url);
  document.querySelector(targetEl).innerHTML = html;
}

// Widoki mają strukturę: <div class="sub-nav">...</div><div class="view-contents">...content items...</div>
async function loadView(name) {
  const viewUrl = `views/${name}.html`;
  const html = await loadHTML(viewUrl);

  const tmp = document.createElement('div');
  tmp.innerHTML = html;

  const subnav = tmp.querySelector('.sub-nav');
  const viewContents = tmp.querySelector('.view-contents');

  subnavContainer.innerHTML = subnav ? subnav.outerHTML : '';
  contentContainer.innerHTML = viewContents ? viewContents.innerHTML : '';

  // Usuń ewentualne inline display ustawione w plikach widoków — pozwól klasom CSS kontrolować widoczność
  contentContainer.querySelectorAll('.content').forEach(c => {
    c.style.display = '';
    c.classList.remove('active');
  });

  // Jeśli istnieje subnav, aktywuj zawartość powiązaną z pierwszym (lub aktywnym) subtabem.
  if (subnav) {
    const navEl = subnavContainer.querySelector('.sub-nav');
    // wybierz span aktywny lub pierwszy
    const firstSub = navEl.querySelector('span[data-subtab].active') || navEl.querySelector('span[data-subtab]');
    if (firstSub) {
      // ustaw widok odpowiadający temu subtabowi
      const targetId = firstSub.dataset.subtab;
      const targetContent = contentContainer.querySelector(`#${targetId}`);
      if (targetContent) targetContent.classList.add('active');
      // upewnij się, że podnav ma aktywność zaznaczoną
      navEl.querySelectorAll('span').forEach(s => s.classList.toggle('active', s === firstSub));
    } else {
      // fallback: włącz pierwszą content jeśli nic nie znaleziono
      const firstContent = contentContainer.querySelector('.content');
      if (firstContent) firstContent.classList.add('active');
    }
  } else {
    // brak subnav — aktywuj pierwszy block content (map, radio, games)
    const firstContent = contentContainer.querySelector('.content');
    if (firstContent) firstContent.classList.add('active');
  }

  // Pokaz/ukryj inv actions
  invActionsContainer.innerHTML = '';
  if (name === 'inv') {
    const invActionsHtml = await loadHTML('components/inv-actions.html');
    invActionsContainer.innerHTML = invActionsHtml;
  }

  // Po wstrzyknięciu podłącz eventy
  setupSubnavHandlers();
  setupItemSelection();
}

// Event delegacja top-nav
async function init() {
  await loadComponent('components/top-nav.html', '#top-nav-container');
  await loadComponent('components/footer.html', '#footer-container');

  // Domyślnie pierwsza karta (stat)
  await loadView('stat');

  // Delegacja kliknięć top-nav
  topNavContainer.addEventListener('click', async (ev) => {
    const target = ev.target.closest('[data-tab]');
    if (!target) return;
    // Aktualizacja aktywnego wyglądu
    topNavContainer.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
    target.classList.add('active');

    const tabName = target.dataset.tab;
    await loadView(tabName);
  });
}

function setupSubnavHandlers() {
  // Podłącz kliknięcia sub-tabów w subnavContainer
  const nav = subnavContainer.querySelector('.sub-nav');
  if (!nav) return;

  nav.querySelectorAll('span[data-subtab]').forEach((s) => {
    s.addEventListener('click', () => {
      // toggle active on subnav
      nav.querySelectorAll('span').forEach(x => x.classList.remove('active'));
      s.classList.add('active');

      // hide all contents and show matching
      const sub = s.dataset.subtab;
      contentContainer.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
      const el = contentContainer.querySelector(`#${sub}`);
      if (el) el.classList.add('active');
    });
  });

  // Ensure first subtab activates its content (in case of view load)
  const first = nav.querySelector('span[data-subtab].active') || nav.querySelector('span[data-subtab]');
  if (first) {
    // Nie wywołujemy .click() aby uniknąć powtórnego dodawania klas — ręcznie aktywujemy treść
    nav.querySelectorAll('span').forEach(x => x.classList.remove('active'));
    first.classList.add('active');
    const sub = first.dataset.subtab;
    contentContainer.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
    const el = contentContainer.querySelector(`#${sub}`);
    if (el) el.classList.add('active');
  }
}

function setupItemSelection() {
  // .special-item, .perk-item, .inv-item, .data-item
  contentContainer.querySelectorAll('.special-item, .perk-item, .inv-item, .data-item').forEach(item => {
    item.addEventListener('click', () => {
      const parent = item.parentElement;
      parent.querySelectorAll('.active').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Jeśli to quest z data-quest-id, wyświetl jego zawartość
      if (item.hasAttribute('data-quest-id')) {
        const questId = item.getAttribute('data-quest-id');
        const questsPreview = contentContainer.querySelector('.quests-preview');
        const questsData = contentContainer.querySelector('.quests-data');

        if (questsPreview && questsData) {
          const questItem = questsData.querySelector(`.quest-item[data-quest-id="${questId}"]`);

          if (questItem) {
            const title = questItem.querySelector('.quest-title').textContent;
            const description = questItem.querySelector('.quest-description').textContent;
            const objectives = questItem.querySelector('.quest-objectives');

            questsPreview.querySelector('.quests-title').textContent = title;
            questsPreview.querySelector('.quests-description').textContent = description;

            // Wyświetl objectives
            const objectivesContainer = questsPreview.querySelector('.quest-objectives');
            if (objectivesContainer && objectives) {
              objectivesContainer.innerHTML = objectives.innerHTML;
            }
          }
        }
      }

      // Jeśli to notatka z data-note-id, wyświetl jej zawartość
      if (item.hasAttribute('data-note-id')) {
        const noteId = item.getAttribute('data-note-id');
        const notesPreview = contentContainer.querySelector('.notes-preview');
        const notesData = contentContainer.querySelector('.notes-data');

        if (notesPreview && notesData) {
          const noteItem = notesData.querySelector(`.note-item[data-note-id="${noteId}"]`);

          if (noteItem) {
            const title = noteItem.querySelector('.note-title').textContent;
            const content = noteItem.querySelector('.note-content').textContent;

            notesPreview.querySelector('.notes-title').textContent = title;
            notesPreview.querySelector('.notes-text').textContent = content;
          }
        }
      }
    });
  });
}

// Start
init().catch(err => {
  console.error(err);
  document.body.insertAdjacentHTML('beforeend', `<pre style="color:red">${err.message}</pre>`);
});