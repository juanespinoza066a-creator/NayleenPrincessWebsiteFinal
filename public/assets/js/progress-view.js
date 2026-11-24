// Keep cards/images in place while their live requirement values advance.
export function updateProgress(grid,items,progress){for(let index=0;index<items.length;index++){const list=grid.children[index]?.querySelector('.outfit-goals:not(.sacrifice-days)');if(!list)continue;for(const [i,g] of progress(items[index]).entries()){const line=list.children[i*2],meter=list.children[i*2+1],text=g.label+' · '+g.value+' / '+g.goal;if(line&&line.textContent!==text)line.textContent=text;if(meter&&Number(meter.value)!==g.value)meter.value=g.value;}}}

export function updateSacrificeBars(grid, items, state, kind, now = Date.now()) {
    const day = 86400000;
    items.forEach((item, index) => {
        const card = grid.children[index];
        if (!card) return;
        const until = state.sacrificeUntil?.[kind + ':' + item.id] || 0;
        const remaining = Math.max(0, Math.min(14, (until - now) / day));
        let row = card.querySelector('.sacrifice-days');
        if (!remaining) {
            row?.remove();
            return;
        }
        if (!row) {
            row = document.createElement('span');
            row.className = 'outfit-goals sacrifice-days';
            const meter = document.createElement('progress');
            meter.max = 14;
            row.append(document.createElement('span'), meter);
            card.append(row);
        }
        const days = Math.ceil(remaining);
        const label = 'Locked for ' + days + (days === 1 ? ' more day' : ' more days');
        if (row.firstElementChild.textContent !== label) {
            row.firstElementChild.textContent = label;
            row.lastElementChild.setAttribute('aria-label', label);
        }
        row.lastElementChild.value = remaining;
    });
}
