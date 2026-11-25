import { ensureCodeLogin } from './code-login.js';

const get = id => document.getElementById(id);
const form = get('advent-editor');
const status = get('editor-status');

function download(name, values) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(values, null, 2) + '\n'],
        {type: 'application/json'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = name + ' downloaded. Commit it to publish your changes.';
}

try {
    const account = await ensureCodeLogin();
    if (account?.profile !== 'testing') throw new Error('Sign in with the testing profile to edit Winter 2026.');
    const response = await fetch('api/advent-editor', {cache: 'no-store'});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    get('advent-enabled').checked = data.settings.enabled === true;
    get('advent-preview').checked = data.settings.previewForTesting === true;
    const drafts = new Map();
    for (const day of data.noteDays) {
        const row = document.createElement('p');
        const label = document.createElement('label');
        label.textContent = 'December ' + day;
        const input = document.createElement('textarea');
        input.rows = 5;
        input.cols = 36;
        input.style.boxSizing = 'border-box';
        input.style.display = 'block';
        input.style.maxInlineSize = '100%';
        input.value = data.notes[day] || '';
        label.append(input);
        row.append(label);
        get('advent-note-fields').append(row);
        drafts.set(day, input);
    }
    get('download-settings').onclick = () => download('advent-settings.json', {
        ...data.settings,
        enabled: get('advent-enabled').checked,
        previewForTesting: get('advent-preview').checked,
    });
    get('download-notes').onclick = () => download('advent-notes.json', {
        ...data.notes,
        ...Object.fromEntries([...drafts].map(([day, field]) => [day, field.value])),
    });
    form.hidden = false;
    status.textContent = '';
} catch (error) {
    status.textContent = error.message || 'The calendar editor couldn’t load.';
}
