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
        <ul>
            <li>New outfits, collectibles, and rooms to make the Palace yours.</li>
            <li>Open Advent surprises and revisit your saved gifts anytime.</li>
            <li>See a week ahead in Espurr’s Weather and discover outfits as the weather changes.</li>
            <li>Learn the Hunt with clearer touch instructions and see what you earned in Princess Drop.</li>
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
