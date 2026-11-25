import {cp,mkdir,rm} from 'node:fs/promises';
await mkdir('dist',{recursive:true});await cp('public','dist',{recursive:true});
await rm('dist/content/weekly-notes.json',{force:true});
