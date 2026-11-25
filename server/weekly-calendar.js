export function weekNumber(now = Date.now()) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric'
    }).formatToParts(new Date(now));
    const value = type => Number(parts.find(part => part.type === type).value);
    const date = Date.UTC(value('year'), value('month') - 1, value('day'));
    return Math.max(1, Math.min(52, 2 + Math.floor((date - Date.UTC(2026, 10, 23)) / 604800000)));
}
