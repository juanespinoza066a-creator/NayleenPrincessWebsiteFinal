import assert from 'node:assert/strict';import {parseHTML} from 'linkedom';import {freshState} from '../server/game-rules.js';
const {window,document}=parseHTML('<main><button id="export-save"></button><button id="backup-list"></button><button id="import-trigger"></button><input id="import-save"><p id="backup-status"></p></main><div id="body"></div>');Object.assign(globalThis,{window,document});const {attachRecovery}=await import('../public/assets/js/recovery-panel.js');
const body=document.getElementById('body');let opens=0,requests=[];const realFetch=fetch;globalThis.fetch=async(path,opts={})=>{requests.push([path,opts]);return {ok:true,json:async()=>({state:{...freshState(),chips:345},revision:8,backups:[{id:1,created_at:'2026-11-20T00:00:00Z',reason:'automatic'}]})};};
const store={state:freshState(),profile:'nayleen',ready:true,online:true,dirty:false,revision:7,async save(){},remember(){},emit(){}};attachRecovery(store,{open(){opens++;body.replaceChildren();},close(){},body});
const upload=document.getElementById('import-save');try{
await upload.onchange({target:{files:[{size:10,text:async()=>JSON.stringify({kind:'nayleen-carnival-backup',profile:'testing',state:freshState()})}],value:''}});assert.equal(opens,0);assert.equal(requests.length,0);
await upload.onchange({target:{files:[{size:10,text:async()=>JSON.stringify({kind:'nayleen-carnival-backup',profile:'nayleen',state:freshState()})}],value:''}});assert.equal(opens,1);assert.equal(requests.length,0,'upload previews without changing progress');
await [...body.querySelectorAll('button')].find(b=>b.textContent==='Restore this account data').onclick();assert.equal(store.state.chips,345);assert.equal(store.revision,8);assert.equal(store.saving,false);assert.equal(requests[0][0],'api/backups');
await document.getElementById('backup-list').onclick();assert(body.textContent.includes('Download this backup'));assert(body.textContent.includes('Remove this backup'));
console.log('PASS: recovery UI rejects cross-profile file before any request, requires review, adopts acknowledged restored state/revision and exposes download/delete controls.');
}finally{globalThis.fetch=realFetch;}
