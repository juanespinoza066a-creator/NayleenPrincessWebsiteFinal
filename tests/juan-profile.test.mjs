import assert from 'node:assert/strict';
import {config, profileForCode, hash} from '../server/common.js';
import login from '../api/code-session.js';
import save from '../api/code-save.js';
import companion from '../api/companion.js';
import backups from '../api/backups.js';
import editor from '../api/advent-editor.js';
import {freshState} from '../server/game-rules.js';

Object.assign(process.env, {
    SUPABASE_URL:'https://db.example.invalid', SUPABASE_SECRET_KEY:'fixture-key',
    CARNIVAL_LOGIN_CODE:'fixture-main',CARNIVAL_TEST_CODE:'fixture-testing',CARNIVAL_JUAN_CODE:'fixture-juan'
});
const sessions = new Map();
const writes = [];
globalThis.fetch = async (url, opts) => {
    const path = new URL(url);
    if (path.pathname.endsWith('/carnival_take_attempt')) return Response.json(true);
    if (path.pathname.endsWith('/carnival_sessions') && opts.method === 'POST') {
        const value = JSON.parse(opts.body);
        sessions.set(value.token_hash, value);
        return Response.json([]);
    }
    if (path.pathname.endsWith('/carnival_sessions'))
        return Response.json([sessions.get(path.searchParams.get('token_hash').slice(3))].filter(Boolean));
    if (path.pathname.endsWith('/carnival_saves')) {
        return Response.json(path.searchParams.get('profile') === 'eq.juan' ? [] :
            [{state:{...freshState(),chips:920},revision:8}]);
    }
    if (path.pathname.endsWith('/carnival_write_save')) {
        writes.push(JSON.parse(opts.body));
        return Response.json([{revision:1}]);
    }
    throw new Error('Unexpected endpoint ' + path.pathname);
};
async function request(handler, method, headers = {}, body) {
    const response = {headers:{},setHeader(k,v){this.headers[k]=v;},end(raw){this.data=JSON.parse(raw);}};
    await handler({method,headers,body},response);
    return response;
}
const cookies = {};
for (const [profile, code] of Object.entries({nayleen:'fixture-main',testing:'fixture-testing',juan:'fixture-juan'})) {
    assert.equal(profileForCode(code),profile);
    const result = await request(login,'POST',{}, {code});
    assert.equal(result.statusCode,200);
    assert.equal(result.data.profile,profile);
    cookies[profile]=result.headers['Set-Cookie'].split(';')[0];
    const raw=cookies[profile].split('=')[1];
    assert.equal(sessions.get(hash(raw)).profile,profile);
}
const juan = {cookie:cookies.juan};
const loaded = await request(login,'GET',{...juan,'x-palace-load':'progress'});
const nayleen = await request(login,'GET',{cookie:cookies.nayleen,'x-palace-load':'progress'});
assert.equal(loaded.data.save.userId,'juan-code-profile');
assert.equal(loaded.data.save.state,null);
assert.equal(nayleen.data.save.state.chips,920);
assert.equal(loaded.data.adventEnabled,nayleen.data.adventEnabled);
assert.equal(loaded.data.adventPreview,nayleen.data.adventPreview);
assert.equal((await request(editor,'GET',juan)).statusCode,403);
assert.equal((await request(save,'PUT',juan,{action:'reset-testing'})).statusCode,403);
for (const handler of [save,companion,backups])
    assert.equal((await request(handler,handler === backups ? 'POST' : 'PUT',
        {...juan,'x-palace-profile':'nayleen'},{})).statusCode,409);
const saved = await request(save,'PUT',{...juan,'x-palace-profile':'juan'}, {state:freshState(),revision:0});
assert.equal(saved.statusCode,200);
assert.deepEqual(writes.map(write=>write.p_profile),['juan']);
delete process.env.CARNIVAL_JUAN_CODE;
assert.equal((await request(login,'GET',juan)).data.signedIn,false);
process.env.CARNIVAL_JUAN_CODE='fixture-main';
assert.throws(config,/different code/);
console.log('PASS: Juan signs in as an isolated player with Nayleen’s calendar access and no testing tools.');
