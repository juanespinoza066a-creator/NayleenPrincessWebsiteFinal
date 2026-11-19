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
let checkpointAt = 0;
function saveCheckpoint() {
    if (!['playing', 'paused', 'peanut'].includes(state))
        return;
    window.CarnivalManor?.checkpoint({ player: { x: player.x, y: player.y, facing: player.facing, facingY: player.facingY }, hunter: { x: hunter.x, y: hunter.y }, hp, stamina, charges, elapsed, machines: machines.map(m => m.progress), pallets: pallets.map(p => p.down) });
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
function message(text) { $('status').textContent = text; }
async function reset() {
    const access = await window.CarnivalManor?.begin();
    if (!access) {
        state = 'locked';
        modal('Your weekly adventure is resting.', 'This week’s run is finished. A new maze adventure opens next Monday. Your collected treasures are waiting in Espurr’s room.', 'Back to Espurr’s room');
        return;
    }
    peanutFound = window.CarnivalManor?.peanut?.found === true;
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
    machines.forEach(m => { m.progress = 0; m.lockRemaining = 0; m.nextCheck = randomBetween(5.5, 11.5); });
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
    }
    checkpointAt = elapsed;
    keys.clear();
    $('stick').style.transform = '';
    state = 'playing';
    overlay.close();
    message(access.checkpoint ? (exitUnlocked() ? 'All ciphers complete! The exit is unlocked. Follow the moon marker to the gate.' : 'Your weekly adventure is right where you left it.') : 'Find three machines and one hidden treasure. Ann wanders the whole garden; hedges hide you.');
    saveCheckpoint();
    canvas.focus();
    hud();
}
function modal(title, copy, button) {
    $('overlay-title').textContent = title;
    $('overlay-copy').replaceChildren();
    const p = document.createElement('p');
    p.textContent = copy;
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
        modal('Ann caught up this time.', 'Use hedges to break sight, guard your sprint energy, and stun Ann when she gets close. Your found treasures stay in your room. A new weekly adventure opens next Monday.', 'Back to Espurr’s room');
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

function power() {
    if (state !== 'playing' || charges < 1)
        return;
    if (distance(player, hunter) > 155) {
        message('Ann is too far away. Save the psychic stun for a close chase.');
        return;
    }
    window.ManorAudio?.effect('stun');
    charges--;
    stunned = 5;
    effects.push({ kind: 'stun', x: player.x, y: player.y, life: .7, duration: .7 });
    message('Psychic stun! Ann is frozen for five seconds.');
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
    elapsed += dt;
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
    stamina = Math.max(0, Math.min(100, stamina + (sprint ? -20 : 23) * dt));
    const px = player.x, py = player.y;
    move(player, dx * (sprint ? 174 : 112) * dt, dy * (sprint ? 174 : 112) * dt);
    player.moving = distance(player, { x: px, y: py }) > .01;
    player.walk = (player.walk || 0) + (player.moving ? dt * (sprint ? 18 : 12) : 0);
    if (mag > .1) {
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
        repairing.progress = Math.min(40, repairing.progress + dt * 3.0);
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
        if (repairing.progress >= 40) {
            effects.push({ kind: 'spark', x: repairing.x, y: repairing.y, life: .8, duration: .8 });
            repairing = null;
            calibration = null;
            window.ManorAudio?.effect('complete');
            charges = Math.min(3, charges + 1);
            if (exitUnlocked()) {
                calmTime = Math.max(calmTime, 6);
                message('All ciphers complete! THE EXIT IS UNLOCKED. Follow the moon marker to the gate.');
                effects.push({kind:'spark',x:gate.x,y:gate.y,life:2,duration:2});
            } else message('Cipher complete! Psychic charge restored. Find the next cipher.');
        }
    }
    // Hedges really hide you. Decoding never reveals the player's position.
    calmTime = Math.max(0, calmTime - dt);
    const seesPlayer = calmTime === 0 && distance(player, hunter) < 225 && clearSight();
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
        const goal = chase ? (seesPlayer ? player : lastSeen) : noiseTime > 0 && noiseTarget && distance(hunter, noiseTarget) < 260 ? noiseTarget : patrol[patrolIndex];
        // Keep the current waypoints while patrolling. Constant repathing at corners caused sticking.
        const goalKey = tile(goal).join(',');
        if (!path.length || (pathClock <= 0 && chase && patrolGoal !== goalKey)) {
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
            window.ManorAudio?.effect('hit');
            action = null; repairing = null; calibration = null;
            hp--;
            invincible = 7;
            stunned = 2.5;
            hunter.attack = .65;
            message('Ann landed a hit. Sprint or stun to escape!');
            if (hp <= 0) {
                finish(false);
                hud();
                return;
            }
        }
    }
    hud();
}
function hud() {
    const complete = machines.filter(m => m.progress === 40).length;
    $('health').textContent = '♥ '.repeat(hp) + '♡ '.repeat(3 - hp);
    $('health').setAttribute('aria-label', hp + ' of 3 hearts');
    $('objectives').textContent = complete + ' / 3 ciphers · ' + (exitUnlocked() ? 'Exit unlocked' : 'Exit locked');
    $('peanut-bag').disabled = !peanutFound;
    $('peanut-bag').textContent = peanutFound ? '🥜 My peanut' : '🥜 Find peanut';
    $('peanut-bag').setAttribute('aria-label', peanutFound ? 'Open your crunchy peanut' : 'Find the crunchy peanut in the western garden');
    $('machine-count').textContent = '⚙ ' + complete + ' / 3';
    $('exit-status').textContent = exitUnlocked() ? '☾ Exit unlocked' : '☾ Exit locked';
    $('exit-status').classList.toggle('exit-ready', exitUnlocked());
    $('loot-count').textContent = '✧ ' + (window.CarnivalManor?.loot?.filter(x => x.claimed).length || 0) + ' / 1';
    $('threat').textContent = stunned > 0 ? 'Ann is stunned' : chase ? 'Ann is searching' : 'Garden is quiet';
    $('threat').classList.toggle('danger', chase && stunned === 0);
    $('clock').textContent = Math.floor(elapsed / 60) + ':' + String(Math.floor(elapsed % 60)).padStart(2, '0');
    $('stamina').value = stamina;
    const jammed = repairing?.lockRemaining > 0;
    $('repair').max = action ? action.duration : jammed ? 3 : 40;
    $('repair').value = action ? action.elapsed : jammed ? 3 - repairing.lockRemaining : repairing?.progress || 0;
    $('repair-note').hidden = !repairing && !action;
    $('repair-note').classList.toggle('jammed', Boolean(jammed));
    $('repair-label').textContent = action ? action.label.toUpperCase() + ' · ' + Math.floor(action.elapsed / action.duration * 100) + '%' : jammed ? 'CIPHER LOCKED · ' + repairing.lockRemaining.toFixed(1) + 's' : calibration ? 'CALIBRATION ' + (calibration.phase === 'warning' ? 'INCOMING' : 'ACTIVE') : 'DECODING · ' + Math.floor((repairing?.progress || 0) / 40 * 100) + '%';
    $('power').textContent = '✦ Psychic stun · ' + charges;
    $('power').disabled = charges === 0;
    const c = context(), active = calibration?.phase === 'active';
    $('interact').textContent = action ? 'Working…' : jammed ? 'Cipher locked…' : repairing ? (active ? 'Calibrate · E' : 'Decoding…') : c ? c.label : 'Find an objective';
    $('interact').disabled = action || jammed ? true : repairing ? !active : !c;
    $('interact').classList.toggle('calibrate', active);
}
function draw() {
    drawManor({ canvas, player, hunter, machines, pallets, walls, gate, elapsed, stunned, invincible, calibration, repairing, chase, effects, peanut, peanutFound, treasures: treasures.map(item => ({ ...item, ...window.CarnivalManor?.loot?.[item.index] })), T, COLS, ROWS });
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
    modal('A few garden tips', 'Move with the thumb stick or WASD. E starts repairs and hits calibration checks. The ring only appears occasionally — wait for it, then tap in the gold arc. Press Space or tap Psychic stun when Ann is within about four garden tiles. It freezes her for five seconds and uses one of three charges. Completing a cipher restores one charge, up to three. A failed calibration locks that cipher for three seconds. Stay still to collect treasure, pick up the peanut, drop a pallet, or open the gate; moving or taking a hit cancels the action. Hold Sprint or Shift to run. Break line of sight behind hedges.', 'Resume adventure');
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
