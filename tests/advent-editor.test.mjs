import assert from 'node:assert/strict';
import handler from '../api/advent-editor.js';
import updates from '../api/updates.js';
import login from '../api/code-session.js';
import { freshState } from '../server/game-rules.js';

Object.assign(process.env, {
    SUPABASE_URL:'https://db.example.invalid',
    SUPABASE_SECRET_KEY:'fixture-only',
    CARNIVAL_LOGIN_CODE:'fixture-main',
    CARNIVAL_TEST_CODE:'fixture-test'
});
let profile = 'testing';
let renewals = 0;
const originalCookie = '__Host-nayleen-session=' + 'a'.repeat(64);
globalThis.fetch = async (url, options) => {
    if (options.method === 'PATCH') {
        renewals++;
        assert(url.includes('expires_at=gt.'));
        assert(Date.parse(JSON.parse(options.body).expires_at) > Date.now() + 6 * 86400000);
        return Response.json([{profile}]);
    }
    if (url.includes('/carnival_saves?')) return Response.json([{state:freshState(),revision:12}]);
    return Response.json([{profile,expires_at:new Date(Date.now()+3600000).toISOString()}]);
};

async function request(fn, method = 'GET', headers = {}) {
    let response;
    const out = { headers:{}, statusCode:0, setHeader(k,v){this.headers[k]=v;},end(value){response=JSON.parse(value);} };
    await fn({method,headers},out);
    return {...out,response};
}
assert.equal((await request(handler)).statusCode,401);
assert.equal((await request(handler,'POST',{cookie:originalCookie})).statusCode,405);
profile = 'nayleen';
assert.equal((await request(handler,'GET',{cookie:originalCookie})).statusCode,403);
profile = 'testing';
const edit = await request(handler,'GET',{cookie:originalCookie});
assert.equal(edit.statusCode,200);
assert.equal(edit.headers['Cache-Control'],'no-store');
assert.deepEqual(edit.response.noteDays,[7,14,19]);
assert.equal(typeof edit.response.settings.enabled,'boolean');
const notice = await request(updates,'GET',{cookie:originalCookie});
assert.equal(notice.statusCode,200);
assert.match(notice.response.noteVersion,/^[a-f0-9]{64}$/);
assert(!('notes' in notice.response),'notification checks never download private messages');
assert.equal((await request(updates,'GET',{cookie:originalCookie})).response.noteVersion,notice.response.noteVersion);
await request(login,'GET',{cookie:originalCookie,'x-palace-load':'progress'});
assert.equal(renewals,0,'browser keeps existing session lifetime');
const renewed = await request(login,'GET',{cookie:originalCookie,'x-palace-load':'progress','x-palace-device':'1'});
assert.equal(renewals,1);
assert.equal(renewed.response.save.revision,12);
assert(renewed.headers['Set-Cookie'].includes('HttpOnly'));
console.log('PASS: editors only receive their authorized drafts, weekly alerts use a stable digest, and verified device sync renews eligible sessions.');
