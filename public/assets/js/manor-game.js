const $ = id => document.getElementById(id);
const canvas = $('world'), ctx = canvas.getContext('2d');
const overlay = $('overlay');
const T = 40, COLS = 25, ROWS = 19;
const walls = new Set();
for (let x = 0; x < COLS; x++) {
    walls.add(x + ',0');
    walls.add(x + ',' + (ROWS - 1));
}
for (let y = 0; y < ROWS; y++) {
    walls.add('0,' + y);
    walls.add((COLS - 1) + ',' + y);
}
for (const [x, y, w, h] of [[4, 3, 1, 6], [8, 1, 1, 5], [8, 8, 5, 1], [13, 3, 1, 5], [17, 5, 5, 1], [18, 9, 1, 5], [3, 12, 5, 1], [10, 12, 1, 5], [13, 15, 5, 1], [21, 13, 1, 4]]) {
    for (let dx = 0; dx < w; dx++)
        for (let dy = 0; dy < h; dy++)
            walls.add((x + dx) + ',' + (y + dy));
}
const center = (x, y) => ({ x: (x + .5) * T, y: (y + .5) * T });
const machines = [[3, 3], [21, 3], [14, 13]].map(([x, y]) => ({ ...center(x, y), progress: 0, nextCheck: randomBetween(5.5, 11.5) }));
const gate = center(23, 16);
const exitUnlocked = () => machines.every(m => m.progress >= 40);
const peanut = center(6, 6);
const treasures = [[6, 10]].map(([x, y], index) => ({ ...center(x, y), index }));
let checkpointAt = 0, huntConfig=null, abilityTime=0,hiddenTime=0,swiftTime=0,decodeTime=0,hazardClock=7,hazards=[],snareTime=0,photoTime=0,rootTime=0,waterTime=0,decoy=null;
const currentPower=()=>window.CarnivalManor?.powers?.[window.CarnivalManor.outfit]||{name:'Psychic stun',type:'stun',hint:'Freeze a nearby hunter for 5 seconds.'};
const hunterName=()=>huntConfig?.hunterName||'Ann';
function saveCheckpoint() {
    if (!['playing', 'paused', 'peanut'].includes(state))
        return;
    window.CarnivalManor?.checkpoint({ player: { x: player.x, y: player.y, facing: player.facing, facingY: player.facingY, travelX:player.travelX||0,travelY:player.travelY||0 }, hunter: { x: hunter.x, y: hunter.y }, hp, stamina, charges, elapsed, peanutFound, timers:{hiddenTime,swiftTime,decodeTime,snareTime,photoTime,rootTime,waterTime,invincible,stunned,hazardClock,calmTime,searchTime,noiseTime}, hazards:hazards.map(h=>({...h})),decoy,lastSeen,noiseTarget,locks:machines.map(m=>m.lockRemaining||0),checks:machines.map(m=>m.nextCheck), machines: machines.map(m => m.progress), pallets: pallets.map(p => p.down) });
}
window.addEventListener('pagehide', saveCheckpoint);
let peanutFound = false, peanutCount = 0, peanutSound = true, peanutAudio;
const pallets = [[5, 9], [15, 8], [18, 15]].map(([x, y]) => ({ ...center(x, y), down: false }));
const patrol = [[21, 3], [15, 2], [11, 5], [6, 3], [2, 7], [6, 10], [5, 15], [12, 17], [16, 12], [22, 16], [22, 8]].map(([x, y]) => center(x, y));
const keys = new Set();
let player, hunter, state = 'intro', elapsed = 0, hp = 3, stamina = 100, charges = 3;
let action = null;
let repairing = null, invincible = 0, stunned = 0, sprinting = false;
let calibration = null, noiseTime = 0, noiseTarget = null, chase = false;
let lastSeen = null, searchTime = 0, calmTime = 6, patrolGoal = null;
const effects = [];
function randomBetween(min, max) { return min + Math.random() * (max - min); }
let path = [], pathClock = 0, patrolIndex = 0, joy = { x: 0, y: 0 }, last = 0, W = 600, H = 400;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const tile = p => [Math.floor(p.x / T), Math.floor(p.y / T)];
function blocked(x, y) {
    return walls.has(x + ',' + y) || pallets.some(p => p.down && Math.floor(p.x / T) === x && Math.floor(p.y / T) === y);
}
function canStand(x, y, entity) {
    return [[-11, -11], [11, -11], [-11, 11], [11, 11]].every(([dx, dy]) => entity === player ? !walls.has(Math.floor((x + dx) / T) + ',' + Math.floor((y + dy) / T)) : !blocked(Math.floor((x + dx) / T), Math.floor((y + dy) / T)));
}
function move(entity, dx, dy) {
    if (canStand(entity.x + dx, entity.y, entity))
        entity.x += dx;
    if (canStand(entity.x, entity.y + dy, entity))
        entity.y += dy;
}
function findPath(from, to) {
    const [sx, sy] = tile(from), [tx, ty] = tile(to);
    const queue = [[sx, sy]], previous = new Map([[sx + ',' + sy, null]]);
    for (let i = 0; i < queue.length; i++) {
        const [x, y] = queue[i], key = x + ',' + y;
        if (x === tx && y === ty) {
            const result = [];
            let cursor = key;
            while (previous.get(cursor) !== null) {
                const [cx, cy] = cursor.split(',').map(Number);
                result.unshift(center(cx, cy));
                cursor = previous.get(cursor);
            }
            return result;
        }
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
            if (nx < 1 || ny < 1 || nx >= COLS - 1 || ny >= ROWS - 1 || blocked(nx, ny) || previous.has(k))
                continue;
            previous.set(k, key);
            queue.push([nx, ny]);
        }
    }
    return [];
}
function message(text) { $('status').textContent = text.replaceAll('Ann',hunterName()); }
async function reset() {
    const access = await window.CarnivalManor?.begin();
    if (!access) {
        state = 'locked';
        modal('Your weekly adventure is resting.', 'This week’s run is finished. A new maze adventure opens next Monday. Your collected treasures are waiting in Espurr’s room.', 'Back to Espurr’s room');
        return;
    }
    huntConfig=window.CarnivalManor.map;huntConfig.hunterName={ann:'Ann',antonio:'Antonio',joseph:'Joseph',grace:'Grace'}[huntConfig.hunter];walls.clear();for(const tile of huntConfig.walls)walls.add(tile);document.querySelector('.location-tag').textContent=huntConfig.name;document.querySelector('.heading h1').textContent='IDV Hunt · '+huntConfig.hunterName;hazards=[];decoy=null;hazardClock=7;snareTime=photoTime=rootTime=waterTime=0;abilityTime=hiddenTime=swiftTime=decodeTime=0;
    const choices=document.querySelector('.hunt-options');if(choices)choices.hidden=true;const info=document.getElementById('hunt-ability');if(info)info.textContent=currentPower().name+' · '+currentPower().hint+' Three charges; each finished cipher restores one.';
    peanutFound = access.checkpoint?.peanutFound === true;
    peanutCount = window.CarnivalManor?.peanut?.count || 0;

    player = center(2, 9);
    hunter = center(21, 10);
    hp = 3;
    stamina = 100;
    charges = 3;
    elapsed = 0;
    repairing = null;
    action = null;
    invincible = 0;
    stunned = 0;
    calibration = null;
    noiseTime = 0;
    noiseTarget = null;
    chase = false;
    lastSeen = null; searchTime = 0; calmTime = 6; patrolGoal = null;
    effects.length = 0;
    path = [];
    pathClock = 0;
    patrolIndex = 0;
    joy = { x: 0, y: 0 };
    sprinting = false;
    machines.forEach(m => { m.completed=false; m.progress = 0; m.lockRemaining = 0; m.nextCheck = randomBetween(5.5, 11.5); });
    pallets.forEach(p => p.down = false);
    if (access.checkpoint) {
        const saved = access.checkpoint;
        Object.assign(player, saved.player);
        Object.assign(hunter, saved.hunter);
        hp = saved.hp;
        stamina = saved.stamina;
        charges = saved.charges;
        elapsed = saved.elapsed;
        machines.forEach((m, i) => { m.progress = saved.machines[i]; });
        pallets.forEach((p, i) => { p.down = saved.pallets[i]; });
        machines.forEach((m,i)=>{m.completed=m.progress>=40;m.lockRemaining=saved.locks?.[i]||0;m.nextCheck=saved.checks?.[i]??randomBetween(5.5,11.5);});
        const a=saved.timers||{};hiddenTime=a.hiddenTime||0;swiftTime=a.swiftTime||0;decodeTime=a.decodeTime||0;snareTime=a.snareTime||0;photoTime=a.photoTime||0;rootTime=a.rootTime||0;waterTime=a.waterTime||0;invincible=a.invincible||0;stunned=a.stunned||0;hazardClock=a.hazardClock??7;calmTime=a.calmTime??6;searchTime=a.searchTime||0;noiseTime=a.noiseTime||0;
        hazards=(saved.hazards||[]).map(h=>({...h}));decoy=saved.decoy?{...saved.decoy}:null;lastSeen=saved.lastSeen?{...saved.lastSeen}:null;noiseTarget=saved.noiseTarget?{...saved.noiseTarget}:null;

    }
    const peanutSpots=[];for(let y=2;y<17;y++)for(let x=2;x<23;x++){const point=center(x,y);if(!walls.has(x+','+y)&&findPath(center(2,9),point).length&&distance(point,center(2,9))>120&&!machines.some(m=>distance(m,point)<70))peanutSpots.push(point);}let peanutSeed=(access.peanutSeed??access.week??1)*17+(huntConfig.map||0)*7+['ann','antonio','joseph','grace'].indexOf(huntConfig.hunter)*13;const spot=peanutSpots[Math.abs(peanutSeed)%peanutSpots.length];if(spot)Object.assign(peanut,spot);
    checkpointAt = elapsed;
    keys.clear();
    $('stick').style.transform = '';
    state = 'playing';
    overlay.close();
    message(access.checkpoint ? (exitUnlocked() ? 'All ciphers complete! The exit is unlocked. Follow the moon marker to the gate.' : 'Your weekly adventure is right where you left it.') : 'Find three machines and one hidden treasure. Hedges hide you from the hunter.');
    saveCheckpoint();
    canvas.focus();
    hud();
}
function modal(title, copy, button) {
    $('overlay-title').textContent = title;
    $('overlay-copy').replaceChildren();
    const p = document.createElement('p');
    p.textContent = copy.replaceAll('Ann',hunterName());
    $('overlay-copy').append(p);
    $('start').textContent = button;
    if (!overlay.open)
        overlay.showModal();
}
function pause() {
    if (state !== 'playing')
        return;
    state = 'paused';
    saveCheckpoint();
    keys.clear();
    joy = { x: 0, y: 0 };
    $('stick').style.transform = '';
    sprinting = false;
    modal('Take a little breather.', 'Your garden is paused. Espurr and Ann will wait for you.', 'Resume adventure');
}
function finish(won) {
    window.ManorAudio?.effect(won ? 'win' : 'lose');
    action = null;
    state = won ? 'won' : 'lost';
    repairing = null;
    calibration = null;
    keys.clear();
    joy = { x: 0, y: 0 };
    sprinting = false;
    const time = Math.floor(elapsed / 60) + ':' + String(Math.floor(elapsed % 60)).padStart(2, '0');
    if (won) {
        window.CarnivalManor?.finish(true);
        modal('You escaped, princesa!', 'Three ciphers repaired, the moon gate opened, and a very annoyed Ann. Escape time ' + time + '. Your maze outfit reward is earned, and your weekly treasure is waiting in your room. ♛', 'Back to Espurr’s room');
    }
    else {
        window.CarnivalManor?.finish(false);
        modal(hunterName()+' caught up this time.', 'Use hedges to break sight, guard your sprint energy, and stun Ann when she gets close. Your found treasures stay in your room. A new weekly adventure opens next Monday.', 'Back to Espurr’s room');
    }
}
function context() {
    const treasure = treasures.find(item => !window.CarnivalManor?.loot?.[item.index]?.claimed && window.CarnivalManor?.loot?.[item.index] && distance(player, item) < 43);
    if (treasure)
        return { type: 'treasure', item: treasure, label: 'Open hidden treasure' };
    const machine = machines.find(m => m.progress < 40 && distance(player, m) < 54);
    if (machine)
        return { type: 'machine', item: machine, label: 'Repair machine' };
    if (!peanutFound && distance(player, peanut) < 48)
        return { type: 'peanut', label: 'Pick up crunchy peanut' };
    const pallet = pallets.find(p => !p.down && distance(player, p) < 60);
    if (pallet)
        return { type: 'pallet', item: pallet, label: 'Drop pallet' };
    if (distance(player, gate) < 60)
        return { type: 'gate', label: 'Open moon gate' };
    return null;
}
function interact() {
    if (state !== 'playing')
        return;
    if (repairing) {
        if (calibration?.phase === 'active') {
            const needle = calibration.elapsed / calibration.duration;
            resolveCalibration(needle >= calibration.zoneStart && needle <= calibration.zoneStart + calibration.zoneWidth);
        }
        return;
    }
    if (action) return;
    const c = context();
    if (!c) return;
    if (c.type === 'machine') {
        repairing = c.item;
        message(repairing.lockRemaining > 0 ? 'Cipher jammed. Wait for the countdown, or move away.' : 'Decoding automatically. Watch for occasional calibration rings. Move any time to run.');
        return;
    }
    if (c.type === 'gate' && !exitUnlocked()) {
        message('Complete all three ciphers to unlock the exit.');
        return;
    }
    const durations = {treasure: 1.2, peanut: .9, pallet: .55, gate: 5};
    action = {...c, elapsed: 0, duration: durations[c.type]};
    message(c.label + '… Stay still; moving cancels this action.');
    hud();
}
function completeInteraction(c) {
    if (c.type === 'treasure') {
        const reward = window.CarnivalManor?.claim(c.item.index);
        if (reward) window.ManorAudio?.effect('collect');
        if (reward) {
            message(reward.isNew ? reward.name + ' is coming home to Espurr!' : 'Another ' + reward.name + '. It is already in your collection. No extra draw this time.');
            effects.push({ kind: 'spark', x: c.item.x, y: c.item.y, life: .8, duration: .8 });
            saveCheckpoint();
            hud();
        }
        return;
    }
    if (c.type === 'peanut') {
        window.ManorAudio?.effect('collect');
        peanutFound = true;
        savePeanut();
        saveCheckpoint();
        hud();
        message('A crunchy peanut! It’s in your pocket now. Tap the peanut button any time.');
        openPeanut();
    }
    if (c.type === 'pallet') {
        window.ManorAudio?.effect('pallet');
        c.item.down = true;
        if (distance(hunter, c.item) < 95)
            stunned = 4;
        path = [];
        pathClock = 0;
        message('Pallet dropped. Ann needs a new route.');
    }
    if (c.type === 'gate') finish(true);
}

function forgetHunterTrail(){lastSeen=null;searchTime=0;noiseTime=0;noiseTarget=null;chase=false;path=[];pathClock=0;patrolGoal=null;}
function completeCipher(m){
 if(m.progress<40||m.completed)return;m.completed=true;m.progress=40;
 if(repairing===m){repairing=null;calibration=null;}
 effects.push({kind:'spark',x:m.x,y:m.y,life:.8,duration:.8});window.ManorAudio?.effect('complete');charges=Math.min(3,charges+1);
 if(exitUnlocked()){calmTime=Math.max(calmTime,6);message('All ciphers complete! THE EXIT IS UNLOCKED. Follow the moon marker to the gate.');effects.push({kind:'spark',x:gate.x,y:gate.y,life:2,duration:2});}
 else message('Cipher complete! A power charge is restored. Find the next cipher.');
 saveCheckpoint();
}
function takeHit(copy){
 if(invincible>0||state!=='playing')return false;
 hp--;invincible=7;action=null;repairing=null;calibration=null;hiddenTime=0;
 window.ManorAudio?.effect('hit');effects.push({kind:'ability',ability:'hurt',label:'−1 heart',x:player.x,y:player.y,life:1.5,duration:1.5});message(copy);
 if(hp<=0)finish(false);else saveCheckpoint();return true;
}
function power() {
 if(state!=='playing'||charges<1)return;const power=currentPower(),kind=power.type;
 if(['stun','fireworks','borrow'].includes(kind)&&distance(player,hunter)>(kind==='fireworks'?260:155)){message('The hunter is too far away. Save your power for a closer chase.');return;}
 if(kind==='luck'&&machines.every(m=>m.progress>=40)){message('All ciphers are ready. Save your charge.');return;}
 charges--;window.ManorAudio?.effect('stun');
 if(kind==='stun')stunned=5;
 if(kind==='heal'){hp=Math.min(3,hp+1);invincible=4;}
 if(kind==='energy'){stamina=100;swiftTime=6;}
 const origin={...player};
 if(kind==='blink'||kind==='dash'){let dx=player.travelX||0,dy=player.travelY||0;const length=Math.hypot(dx,dy);if(length<.1){dx=player.facingY===-1?0:player.facing||1;dy=player.facingY===-1?-1:0;}else{dx/=length;dy/=length;}for(let i=0;i<(kind==='blink'?16:10);i++)move(player,dx*10,dy*10);invincible=1;if(kind==='dash'&&distance(player,hunter)<130)stunned=2;}
 if(kind==='smoke'){hiddenTime=8;forgetHunterTrail();}
 if(kind==='cleanse'){hazards=[];snareTime=photoTime=rootTime=waterTime=0;invincible=6;}
 if(kind==='borrow'){stunned=3;swiftTime=6;}
 if(kind==='focus'){hp=Math.min(3,hp+1);decodeTime=10;}
 if(kind==='fireworks')stunned=4;
 if(kind==='veil'){hiddenTime=5;invincible=7;forgetHunterTrail();}
 if(kind==='paint'){if(distance(player,hunter)<=225)stunned=4;decodeTime=8;}
 if(kind==='luck'){const m=machines.filter(m=>m.progress<40).sort((a,b)=>distance(player,a)-distance(player,b))[0];m.progress=Math.min(40,m.progress+10);completeCipher(m);}
 if(kind==='warm'){swiftTime=8;hiddenTime=3;stamina=100;forgetHunterTrail();}
 if(kind==='decoy'){const candidates=[];for(let y=1;y<18;y++)for(let x=1;x<24;x++){const q=center(x,y);if(!blocked(x,y)&&distance(q,hunter)>90&&distance(q,hunter)<300&&distance(q,player)>100)candidates.push(q);}candidates.sort((a,b)=>distance(b,player)-distance(a,player));const target=candidates.find(q=>findPath(hunter,q).length)||center(...tile(player));decoy={...target,life:8};hiddenTime=8;lastSeen=null;searchTime=0;chase=false;path=[];pathClock=0;patrolGoal=null;}
 if(kind==='case'){if(action){const done=action;action=null;completeInteraction(done);}else if(repairing&&!(repairing.lockRemaining>0)){const m=repairing;m.progress=Math.min(40,m.progress+6);completeCipher(m);}hiddenTime=4;forgetHunterTrail();}
 effects.push({kind:'ability',ability:kind,label:power.name,x:player.x,y:player.y,fromX:origin.x,fromY:origin.y,life:2.5,duration:2.5});message(power.name+'! '+power.hint);saveCheckpoint();hud();
}
function hazardContains(h,p){return h.kind==='joseph'?Math.abs(p.x-h.x)<=h.r&&Math.abs(p.y-h.y)<=h.r:distance(p,h)<=h.r;}
function updateHazards(dt){
 // All durations tick on the game clock, never while paused.
 abilityTime=Math.max(0,abilityTime-dt);hiddenTime=Math.max(0,hiddenTime-dt);swiftTime=Math.max(0,swiftTime-dt);decodeTime=Math.max(0,decodeTime-dt);snareTime=Math.max(0,snareTime-dt);photoTime=Math.max(0,photoTime-dt);rootTime=Math.max(0,rootTime-dt);waterTime=Math.max(0,waterTime-dt);hazardClock-=dt;
 if(hazardClock<=0&&stunned===0&&huntConfig){
  hazardClock=13;const kind=huntConfig.hunter;
  hazards.push({kind,x:player.x,y:player.y,t:0,warmup:1.8,duration:kind==='grace'?8.5:4.5,r:kind==='joseph'?68:kind==='grace'?84:kind==='antonio'?64:52,exposure:0});
  window.ManorAudio?.effect('warning');message(kind==='ann'?'A cat spell is closing. Leave the circle!':kind==='antonio'?'The music will strike inside this circle. Step out!':kind==='joseph'?'A camera is focusing. Leave the frame before the flash!':'Water is rising. Step out before it fills!');
 }
 for(const h of hazards){
  h.t+=dt;if(h.t<(h.warmup??1.8)||h.t>=h.duration)continue;
  const inside=hazardContains(h,player);
  if(h.kind==='grace'){
   h.exposure=inside?Math.min(2,(h.exposure||0)+dt):Math.max(0,(h.exposure||0)-dt*2);
   if(inside&&invincible===0){waterTime=.3;if(h.exposure>=1.8&&!h.triggered){h.triggered=true;takeHit('The tide took one heart. Hurry out of the water!');}}
  }else if(inside&&!h.triggered&&invincible===0){
   h.triggered=true;hiddenTime=0;noiseTime=5;noiseTarget={...player};path=[];pathClock=0;
   if(h.kind==='ann'){rootTime=1.8;action=null;repairing=null;calibration=null;window.ManorAudio?.effect('stun');message('A cat spell froze your steps for a moment!');}
   if(h.kind==='antonio'){stamina=Math.max(0,stamina-40);snareTime=1.2;takeHit('Antonio’s music took one heart and tangled your steps!');}
   if(h.kind==='joseph'){photoTime=1.2;lastSeen={...player};searchTime=5;takeHit('The flash took one heart and revealed your hiding place!');}
  }
  if(state!=='playing')break;
 }
 hazards=hazards.filter(h=>h.t<h.duration);
}
function clearSight() {
    const d = distance(player, hunter), steps = Math.ceil(d / 15);
    for (let i = 1; i < steps; i++) {
        const x = hunter.x + (player.x - hunter.x) * i / steps, y = hunter.y + (player.y - hunter.y) * i / steps;
        if (blocked(Math.floor(x / T), Math.floor(y / T)))
            return false;
    }
    return true;
}
function beginCalibration() {
    window.ManorAudio?.effect('warning');
    calibration = {
        phase: 'warning', elapsed: 0, warningDuration: randomBetween(.65, .9),
        duration: randomBetween(1.65, 2.45), zoneStart: randomBetween(.18, .73),
        zoneWidth: randomBetween(.18, .25), direction: Math.random() < .5 ? -1 : 1
    };
    repairing.nextCheck = randomBetween(5.5, 11.5);
    message('A calibration is coming. Get ready…');
}
function resolveCalibration(success) {
    if (!calibration || !repairing)
        return;
    if (success) {
        window.ManorAudio?.effect('success');
        repairing.progress = Math.min(40, repairing.progress + 3);
        effects.push({ kind: 'spark', x: repairing.x, y: repairing.y, life: .6, duration: .6 });
        message('Perfect calibration! The cipher gained a boost.');
    }
    else {
        window.ManorAudio?.effect('miss');
        repairing.lockRemaining = 3;
        repairing.progress = Math.max(0, repairing.progress - 2.5);
        noiseTime = 2;
        noiseTarget = { x: player.x, y: player.y };
        pathClock = 0;
        message('Calibration missed! Decoding locked for 3 seconds. Ann heard the clatter!');
    }
    calibration = null;
}
function update(dt) {
    if (state !== 'playing')
        return;
    elapsed += dt;updateHazards(dt);if(state!=='playing'){hud();return;}if(decoy){decoy.life-=dt;if(distance(hunter,decoy)<23){stunned=Math.max(stunned,1.5);effects.push({kind:"ability",ability:"decoy",label:"A ribbon surprise!",x:decoy.x,y:decoy.y,life:2,duration:2});decoy=null;}else if(decoy.life<=0)decoy=null;}
    if (elapsed - checkpointAt >= 8) {
        checkpointAt = elapsed;
        saveCheckpoint();
    }
    invincible = Math.max(0, invincible - dt);
    stunned = Math.max(0, stunned - dt);
    noiseTime = Math.max(0, noiseTime - dt);
    for (const machine of machines) machine.lockRemaining = Math.max(0, (machine.lockRemaining || 0) - dt);
    for (let i = effects.length - 1; i >= 0; i--) {
        effects[i].life -= dt;
        if (effects[i].life <= 0)
            effects.splice(i, 1);
    }
    let dx = joy.x + (keys.has('d') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('a') || keys.has('ArrowLeft') ? 1 : 0);
    let dy = joy.y + (keys.has('s') || keys.has('ArrowDown') ? 1 : 0) - (keys.has('w') || keys.has('ArrowUp') ? 1 : 0);
    const mag = Math.hypot(dx, dy);
    if (mag > 1) {
        dx /= mag;
        dy /= mag;
    }
    const sprint = (sprinting || keys.has('Shift')) && stamina > 1 && mag > 0;
    stamina = Math.max(0, Math.min(100, stamina + (waterTime>0 ? -25 : sprint ? -20 : 23) * dt));
    const px = player.x, py = player.y;
    const pace=(swiftTime>0?205:sprint?174:112)*(rootTime>0?0:photoTime>0?.3:snareTime>0||waterTime>0?.6:1);move(player,dx*pace*dt,dy*pace*dt);
    player.moving = distance(player, { x: px, y: py }) > .01;
    player.walk = (player.walk || 0) + (player.moving ? dt * (sprint ? 18 : 12) : 0);
    if (mag > .1) {
        player.travelX=dx;player.travelY=dy;
        player.facingY = Math.abs(dy) > Math.abs(dx) && dy < 0 ? -1 : 0;
        if (Math.abs(dx) > .05)
            player.facing = Math.sign(dx);
    }
    if (mag > .1) {
        if (action) message('Action cancelled. Stay still to finish interacting.');
        action = null;
        repairing = null;
        calibration = null;
            }
    if (action) {
        action.elapsed += dt;
        if (action.elapsed >= action.duration) {
            const finished = action; action = null;
            completeInteraction(finished);
            if (state !== 'playing') { hud(); return; }
        }
    }
    if (repairing && !(repairing.lockRemaining > 0)) {
        repairing.progress = Math.min(40, repairing.progress + dt * (decodeTime>0?5.5:3.0));
        if (calibration) {
            calibration.elapsed += dt;
            if (calibration.phase === 'warning' && calibration.elapsed >= calibration.warningDuration) {
                calibration.phase = 'active';
                calibration.elapsed = 0;
                message('Calibrate now — tap inside the golden arc!');
            }
            else if (calibration.phase === 'active' && calibration.elapsed >= calibration.duration)
                resolveCalibration(false);
        }
        else {
            repairing.nextCheck -= dt;
            if (repairing.nextCheck <= 0 && repairing.progress < 38)
                beginCalibration();
        }
        if (repairing.progress >= 40) completeCipher(repairing);
    }

    // Hedges really hide you. Decoding never reveals the player's position.
    calmTime = Math.max(0, calmTime - dt);
    const seesPlayer = hiddenTime === 0 && calmTime === 0 && distance(player, hunter) < 225 && clearSight();
    if (seesPlayer) { lastSeen = {x: player.x, y: player.y}; searchTime = 2.5; }
    else searchTime = Math.max(0, searchTime - dt);
    const wasChasing = chase;
    chase = seesPlayer || searchTime > 0;
    if (wasChasing && !chase) {
        // Leave the hiding spot alone and continue across the map.
        patrolIndex = (patrolIndex + 3) % patrol.length;
        calmTime = 5;
        path = []; pathClock = 0;
    }
    pathClock -= dt;
    hunter.moving = false;
    hunter.attack = Math.max(0, (hunter.attack || 0) - dt);
    if (stunned === 0) {
        if (!chase && distance(hunter, patrol[patrolIndex]) < 16) {
            patrolIndex = (patrolIndex + 1) % patrol.length;
            path = []; pathClock = 0;
        }
        const goal = decoy ? decoy : chase ? (seesPlayer ? player : lastSeen) : noiseTime > 0 && noiseTarget && distance(hunter, noiseTarget) < 260 ? noiseTarget : patrol[patrolIndex];
        // Keep the current waypoints while patrolling. Constant repathing at corners caused sticking.
        const goalKey = tile(goal).join(',');
        if (!path.length || (pathClock <= 0 && patrolGoal !== goalKey)) {
            path = findPath(hunter, goal);
            const middle = center(...tile(hunter));
            if (distance(hunter, middle) > 3) path.unshift(middle);
            patrolGoal = goalKey;
            pathClock = .8;
            if (!path.length && !chase) patrolIndex = (patrolIndex + 1) % patrol.length;
        }
        if (path.length) {
            const next = path[0], d = distance(hunter, next);
            if (d < 5)
                path.shift();
            else {
                const hx = hunter.x, hy = hunter.y;
                const step = Math.min(d, (chase ? 80 : 60) * dt);
                move(hunter, (next.x - hunter.x) / d * step, (next.y - hunter.y) / d * step);
                hunter.moving = distance(hunter, { x: hx, y: hy }) > .01;
                hunter.walk = (hunter.walk || 0) + (hunter.moving ? dt * (chase ? 9 : 6) : 0);
            }
        }
        if (distance(player, hunter) < 27 && invincible === 0) {
            stunned=2.5;hunter.attack=.65;
            takeHit(hunterName()+' landed a hit. Sprint or use your power to escape!');
            if(state!=='playing'){hud();return;}
        }
    }
    hud();
}
function hud() {
    const complete = machines.filter(m => m.progress === 40).length;
    $('health').textContent = '♥ '.repeat(hp) + '♡ '.repeat(3 - hp);
    $('health').setAttribute('aria-label', hp + ' of 3 hearts');
    $('objectives').textContent = complete + ' / 3 ciphers · ' + (exitUnlocked() ? 'Exit unlocked' : 'Exit locked');
    $('peanut-bag').hidden = !peanutFound;$('peanut-bag').disabled = !peanutFound;
    $('peanut-bag').textContent = '🥜 My peanut';
    $('peanut-bag').setAttribute('aria-label', 'Open your crunchy peanut');
    $('machine-count').textContent = '⚙ ' + complete + ' / 3';
    $('exit-status').textContent = exitUnlocked() ? '☾ Exit unlocked' : '☾ Exit locked';
    $('exit-status').classList.toggle('exit-ready', exitUnlocked());
    $('loot-count').textContent = '✧ ' + (window.CarnivalManor?.loot?.filter(x => x.claimed).length || 0) + ' / 1';
    $('threat').textContent = rootTime>0?'Cat spell · '+Math.ceil(rootTime)+'s':waterTime>0?'Rising water · keep moving':photoTime>0?'Caught in the flash':snareTime>0?'Tangled steps':stunned > 0 ? hunterName()+' is stunned' : chase ? hunterName()+' is searching' : 'Garden is quiet';
    $('threat').classList.toggle('danger', chase && stunned === 0);
    $('clock').textContent = Math.floor(elapsed / 60) + ':' + String(Math.floor(elapsed % 60)).padStart(2, '0');
    $('stamina').value = stamina;
    const jammed = repairing?.lockRemaining > 0;
    $('repair').max = action ? action.duration : jammed ? 3 : 40;
    $('repair').value = action ? action.elapsed : jammed ? 3 - repairing.lockRemaining : repairing?.progress || 0;
    $('repair-note').hidden = !repairing && !action;
    $('repair-note').classList.toggle('jammed', Boolean(jammed));
    $('repair-label').textContent = action ? action.label.toUpperCase() + ' · ' + Math.floor(action.elapsed / action.duration * 100) + '%' : jammed ? 'CIPHER LOCKED · ' + repairing.lockRemaining.toFixed(1) + 's' : calibration ? 'CALIBRATION ' + (calibration.phase === 'warning' ? 'INCOMING' : 'ACTIVE') : 'DECODING · ' + Math.floor((repairing?.progress || 0) / 40 * 100) + '%';
    const activePower=Math.max(hiddenTime,swiftTime,decodeTime,invincible,decoy?.life||0);$('power').textContent='✦ '+currentPower().name+' · '+charges+(activePower>0?' · '+Math.ceil(activePower)+'s':'');
    $('power').disabled = charges === 0;
    const c = context(), active = calibration?.phase === 'active';
    $('interact').textContent = action ? 'Working…' : jammed ? 'Cipher locked…' : repairing ? (active ? 'Calibrate · E' : 'Decoding…') : c ? c.label : 'Find an objective';
    $('interact').disabled = action || jammed ? true : repairing ? !active : !c;
    $('interact').classList.toggle('calibrate', active);
}
function draw() {
    drawManor({ decoy, buffs:{hidden:hiddenTime,swift:swiftTime,decode:decodeTime,shield:invincible,root:rootTime,water:waterTime,photo:photoTime}, huntConfig, hazards, hiddenTime, canvas, player, hunter, machines, pallets, walls, gate, elapsed, stunned, invincible, calibration, repairing, chase, effects, peanut, peanutFound, treasures: treasures.map(item => ({ ...item, ...window.CarnivalManor?.loot?.[item.index] })), T, COLS, ROWS });
}
function frame(now) {
    const dt = Math.min(.04, (now - last) / 1000 || 0);
    last = now;
    update(dt);
    window.ManorAudio?.update(dt, {playing: state === 'playing', chase: chase && stunned === 0, moving: player.moving, decoding: Boolean(repairing && !(repairing.lockRemaining > 0))});
    draw();
    requestAnimationFrame(frame);
}
function savePeanut() { window.CarnivalManor?.savePeanut(peanutFound, peanutCount); }
function openPeanut() {
    if (!peanutFound || state !== 'playing')
        return;
    state = 'peanut';
    keys.clear();
    joy = { x: 0, y: 0 };
    sprinting = false;
    $('stick').style.transform = '';
    $('peanut-count').textContent = peanutCount + ' happy crunches';
    $('peanut-dialog').showModal();
}
function closePeanut() {
    if (state !== 'peanut')
        return;
    $('peanut-dialog').close();
    state = 'playing';
    canvas.focus();
}
function crunchPeanut() {
    if (!peanutSound)
        return;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio)
        return;
    try {
        peanutAudio ??= new Audio();
        if (peanutAudio.state === 'suspended')
            peanutAudio.resume().catch(() => { });
        const duration = .22 + Math.random() * .08;
        const buffer = peanutAudio.createBuffer(1, Math.ceil(peanutAudio.sampleRate * duration), peanutAudio.sampleRate);
        const samples = buffer.getChannelData(0);
        for (let i = 0; i < samples.length; i++) {
            const f = i / samples.length;
            const crackle = Math.max(0, Math.sin(f * 61 + Math.random() * .8));
            samples[i] = (Math.random() * 2 - 1) * crackle * (1 - f) ** 2;
        }
        const source = peanutAudio.createBufferSource(), filter = peanutAudio.createBiquadFilter(), volume = peanutAudio.createGain();
        filter.type = 'lowpass';
        filter.frequency.value = 4200 + Math.random() * 1800;
        volume.gain.value = .32;
        source.buffer = buffer;
        source.connect(filter);
        filter.connect(volume);
        volume.connect(peanutAudio.destination);
        source.start();
    }
    catch { }
}
$('peanut-bag').addEventListener('click', openPeanut);
$('squish-peanut').addEventListener('click', () => {
    peanutCount++;
    savePeanut();
    crunchPeanut();
    $('peanut-count').textContent = peanutCount + ' happy crunches';
    const shell = $('squish-peanut');
    shell.classList.remove('squeezed');
    void shell.offsetWidth;
    shell.classList.add('squeezed');
});
$('peanut-close').addEventListener('click', closePeanut);
$('peanut-dialog').addEventListener('cancel', event => { event.preventDefault(); closePeanut(); });
$('peanut-sound').addEventListener('click', () => {
    peanutSound = !peanutSound;
    $('peanut-sound').textContent = peanutSound ? 'Sound on ♪' : 'Sound off';
    $('peanut-sound').setAttribute('aria-pressed', String(peanutSound));
});
window.addEventListener('keydown', e => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key) && state === 'playing')
        e.preventDefault();
    if (state !== 'playing')
        return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    keys.add(key);
    if (e.repeat)
        return;
    if (key === 'e')
        interact();
    if (key === ' ')
        power();
    if (key === 'Escape')
        pause();
});
window.addEventListener('keyup', e => keys.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key));
window.addEventListener('blur', pause);
document.addEventListener('visibilitychange', () => { if (document.hidden)
    pause(); });
overlay.addEventListener('cancel', e => e.preventDefault());
$('start').addEventListener('click', () => {
    window.ManorAudio?.unlock();
    if (['locked', 'won', 'lost'].includes(state)) {
        location.href = 'carnival.html';
        return;
    }
    if (state === 'paused') {
        state = 'playing';
        overlay.close();
        canvas.focus();
    }
    else
        void reset();
});
$('pause').addEventListener('click', pause);
$('help').addEventListener('click', () => {
    if (state !== 'playing')
        return;
    pause();
    modal(currentPower().name+' · Your outfit power', currentPower().hint+' Start with three charges; finishing a cipher restores one. Move with the stick or WASD. Tap Interact near a cipher and wait for the occasional gold calibration arc. Missing locks that cipher for 3 seconds. Stay still while collecting treasure, dropping a pallet, or opening the exit. Use hedges to hide and hold Sprint to run. Leave a glowing warning area before it fills. Cat spells freeze your steps; music and camera flashes take one heart. Staying in rising water takes a heart too.', 'Resume adventure');
});
$('interact').addEventListener('click', interact);
$('power').addEventListener('click', power);
const pad = $('joystick');
let pointer;
function joystick(e) {
    const r = pad.getBoundingClientRect(), dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2;
    const length = Math.hypot(dx, dy), scale = Math.max(1, length / 36);
    joy = { x: dx / scale / 36, y: dy / scale / 36 };
    $('stick').style.transform = 'translate(' + joy.x * 30 + 'px,' + joy.y * 30 + 'px)';
}
pad.addEventListener('pointerdown', e => { if (pointer !== undefined)
    return; pointer = e.pointerId; pad.setPointerCapture(pointer); joystick(e); });
pad.addEventListener('pointermove', e => { if (e.pointerId === pointer)
    joystick(e); });
function release(e) { if (e.pointerId !== pointer)
    return; pointer = undefined; joy = { x: 0, y: 0 }; $('stick').style.transform = ''; }
pad.addEventListener('pointerup', release);
pad.addEventListener('pointercancel', release);
pad.addEventListener('lostpointercapture', release);
$('sprint').addEventListener('pointerdown', e => { sprinting = true; $('sprint').setPointerCapture(e.pointerId); });
for (const name of ['pointerup', 'pointercancel', 'lostpointercapture'])
    $('sprint').addEventListener(name, () => sprinting = false);
player = center(2, 9);
hunter = center(21, 10);
hud();
overlay.showModal();
requestAnimationFrame(frame);
