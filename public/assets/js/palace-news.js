export function attachPalaceNews() {
    const nav = document.querySelector('header nav');
    if (!nav) return;
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'advent-tab';
    tab.textContent = 'Updates';
    const dialog = document.createElement('dialog');
    dialog.className = 'palace-news';
    dialog.setAttribute('aria-labelledby', 'palace-news-title');
    dialog.innerHTML = `
        <h2 id="palace-news-title">Version 1.0 · New Horizons</h2>
        <p>Since the first little Palace, there’s so much more to make yours ♡</p>
        <ul>
            <li>Dress up Espurr, decorate new rooms with collectibles, and save your favorite looks.</li>
            <li>Play new games, unlock rewards, and open weekly and seasonal surprises.</li>
            <li>Read our weekly letters, keep your own notes, and save special dates with reminders.</li>
            <li>Bring Espurr, your calendar, notes, weather, and music to your home screen with the Palace widget.</li>
            <li>Make playlists, see the week’s weather, and pick up where you left off with saved progress.</li>
        </ul>
        <form method="dialog"><button class="button soft">Back to the Palace</button></form>`;
    tab.onclick = () => { if (!dialog.open) dialog.showModal(); };
    dialog.addEventListener('close', () => {
        if (location.hash === '#palace-updates') window.history?.replaceState(null, '', location.pathname + location.search);
        tab.focus();
    });
    nav.append(tab);
    document.body.append(dialog);
    const fromHash = () => { if (location.hash === '#palace-updates') tab.click(); };
    window.addEventListener('hashchange', fromHash);
    fromHash();
}
