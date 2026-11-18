/* Animated canvas actors and garden artwork. All motion follows the game clock. */
function drawManor(v) {
    const { canvas, player, hunter, machines, pallets, walls, bear, gate, rescued, elapsed: t, stunned, invincible, calibration, repairing, chase, effects, peanut, peanutFound, treasures = [], T, COLS, ROWS } = v;
    const c = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect(), W = rect.width, H = rect.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(W * ratio) || canvas.height !== Math.round(H * ratio)) {
        canvas.width = Math.round(W * ratio);
        canvas.height = Math.round(H * ratio);
    }
    c.setTransform(ratio, 0, 0, ratio, 0, 0);
    c.clearRect(0, 0, W, H);
    const cameraX = Math.max(0, Math.min(COLS * T - W, player.x - W / 2));
    const cameraY = Math.max(0, Math.min(ROWS * T - H, player.y - H / 2));
    function oval(x, y, rx, ry, color) { c.fillStyle = color; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); }
    function line(points, color, width = 2) { c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); }
    function shape(points, color) { c.fillStyle = color; c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); }
    function box(x, y, w, h, r, fill, stroke) { c.beginPath(); c.roundRect(x, y, w, h, r); if (fill) {
        c.fillStyle = fill;
        c.fill();
    } if (stroke) {
        c.strokeStyle = stroke;
        c.lineWidth = 1;
        c.stroke();
    } }
    function glow(x, y, r, color) { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, '#00000000'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }
    function text(x, y, copy, size = 10, color = '#d8c4eb') { c.fillStyle = color; c.font = '500 ' + size + 'px "DM Sans",sans-serif'; c.textAlign = 'center'; c.fillText(copy, x, y); }
    function star(x, y, size, color, rotation = 0) {
        c.save();
        c.translate(x, y);
        c.rotate(rotation);
        shape([[0, -size], [size * .24, -size * .2], [size, 0], [size * .24, size * .2], [0, size], [-size * .24, size * .2], [-size, 0], [-size * .24, -size * .2]], color);
        c.restore();
    }
    function shadow(x, y, rx = 18) { oval(x, y, rx, 5, '#100d1c66'); }
    function crown(x, y, scale = 1) {
        c.save();
        c.translate(x, y);
        c.scale(scale, scale);
        shape([[-11, 0], [-13, -10], [-5, -5], [0, -15], [5, -5], [13, -10], [11, 0]], '#d1b17c');
        line([[-10, 0], [10, 0]], '#f2d6a5', 2);
        oval(0, -5, 2, 3, '#a278d7');
        star(0, -18, 2, '#f7dca4');
        c.restore();
    }
    function espurrActor(p, mini = false) {
        drawPrincessEspurr(c, p, t, window.CarnivalManor?.outfit || 'royal', Boolean(repairing));
    }
    function cat(x, y, scale = 1) {
        c.save();
        c.translate(x, y);
        c.scale(scale, scale);
        c.strokeStyle = '#282133';
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(-7, 3);
        c.bezierCurveTo(-20, 8, -15, -13, -23, -7 + Math.sin(t * 5) * 3);
        c.stroke();
        oval(0, 2, 9, 5, '#242030');
        shape([[3, -4], [4, -13], [9, -8], [15, -12], [16, -1]], '#292334');
        oval(10, -3, 7, 6, '#30273c');
        oval(8, -4, 1.5, 1.1, '#e0cf78');
        oval(13, -4, 1.4, 1.1, '#e0cf78');
        c.restore();
    }
    function annActor(p) {
        c.save();
        c.translate(p.x, p.y);
        shadow(0, 11, 17);
        const stride = p.walk || 0, sway = p.moving ? Math.sin(stride) * 2 : Math.sin(t * 1.6) * 1.2;
        oval(-7, 9 + Math.sin(stride) * 2, 3, 5, '#766e82');
        oval(6, 9 - Math.sin(stride) * 2, 3, 5, '#766e82');
        c.save();
        c.rotate(sway * .02);
        const dress = c.createLinearGradient(-15, -20, 18, 14);
        dress.addColorStop(0, '#4b4354');
        dress.addColorStop(.55, '#262334');
        dress.addColorStop(1, '#161727');
        shape([[-8, -22], [-13, -7], [-18 - sway, 10], [-9, 7], [-4, 12], [1, 9], [8, 12], [14 + sway, 7], [19, 10], [11, -10], [7, -22]], dress);
        line([[-3, -18], [-7, 8]], '#716176', 1);
        line([[4, -16], [10 + sway, 7]], '#54485f', 1);
        shape([[-3, -45], [4, -45], [6, -21], [-4, -21]], '#9c92a4');
        for (let j = 0; j < 5; j++)
            line([[-3, -39 + j * 3], [4, -37 + j * 3]], '#746b81', .65);
        shape([[-9, -57], [-17, -48], [-17, -22], [-24 + sway, -8], [-13, -15], [-8, -32], [7, -30], [13, -13], [21 + sway, -10], [12, -37], [11, -51], [4, -57]], '#24232e');
        oval(0, -46, 8.5, 11, '#b9b6c0');
        shape([[-8, -50], [-4, -55], [5, -53], [9, -47], [4, -49], [-3, -50]], '#535262');
        shape([[-6, -43], [-2, -45], [0, -42], [-3, -40]], '#3c354c');
        shape([[1, -43], [5, -45], [7, -42], [3, -40]], '#3c354c');
        oval(-3.5, -42.8, 1.5, 1, '#d8c46d');
        oval(3.8, -42.8, 1.5, 1, '#d8c46d');
        line([[0, -42], [-1, -37], [1, -37]], '#7a7488', .8);
        line([[-2, -33], [2, -33]], '#696073', .7);
        line([[-8, -53], [-3, -56], [5, -55], [10, -50]], '#777082', 1.2);
        const reach = p.attack > 0 ? Math.sin(p.attack * 9) * 15 : Math.sin(stride) * 2;
        line([[9, -21], [18, -11], [23 + reach, 4]], '#8c8198', 4);
        c.save();
        c.translate(23 + reach, 4);
        c.rotate(-.34 + (p.attack > 0 ? -.7 : Math.sin(t * 1.5) * .06));
        line([[0, -29], [0, 29]], '#73676b', 3);
        shape([[-5, 18], [0, 38], [5, 18]], '#b7a09d');
        for (let j = -20; j < 13; j += 5)
            line([[-2, j], [2, j + 2]], '#bfa9ad', 1);
        c.restore();
        line([[-8, -22], [-17, -13], [-24, -17]], '#8f8298', 4);
        cat(-21, -23, .67);
        c.restore();
        if (stunned > 0) {
            for (let i = 0; i < 3; i++)
                star(Math.cos(t * 3 + i * 2) * 17, -66 + Math.sin(t * 3 + i * 2) * 3, 3, '#d3c5fc', t);
        }
        c.restore();
    }
    function plush(x, y) {
        c.save();
        c.translate(x, y + Math.sin(t * 2) * 1.2);
        shadow(0, 9, 11);
        oval(-7, -11, 4, 4, '#bba5cc');
        oval(7, -11, 4, 4, '#bba5cc');
        oval(0, 2, 8, 10, '#ab8fbf');
        oval(0, -7, 10, 8, '#cab3d7');
        oval(-3, -8, 1.2, 1.5, '#594263');
        oval(3, -8, 1.2, 1.5, '#594263');
        oval(0, -4, 2, 1.3, '#71537e');
        c.restore();
    }
    function machineArt(m, i) {
        c.save();
        c.translate(m.x, m.y);
        shadow(0, 12, 22);
        const done = m.progress >= 40, active = repairing === m;
        glow(0, 0, 50, done ? '#b9ebcb22' : active ? '#ce9afa44' : '#bf8fea1c');
        box(-17, -9, 34, 21, 3, '#53425f', '#9373a7');
        box(-14, -29, 28, 24, 3, '#30283c', '#ad8ac6');
        box(-10, -25, 20, 13, 2, done ? '#9ac9b1' : '#6e5686');
        const wave = active ? Math.sin(t * 11) * 3 : 1;
        line([[-8, -18], [-4, -18], [-1, -18 - wave], [2, -15], [5, -19], [8, -19]], done ? '#e6fff0' : '#dac2fd', 1);
        c.save();
        c.translate(18, -3);
        c.rotate(active ? t * 5 : t * .6);
        for (let n = 0; n < 8; n++) {
            c.rotate(Math.PI / 4);
            box(-2, -11, 4, 5, 1, '#b69cbe');
        }
        oval(0, 0, 7, 7, '#81628d');
        oval(0, 0, 3, 3, '#d6b7e2');
        c.restore();
        for (let k = 0; k < 5; k++)
            box(-11 + k * 5, -3, 3, 4, 1, k < m.progress / 8 ? '#c8a0e7' : '#6c5879');
        if (done)
            star(0, -37, 5, '#d1f2ce', Math.sin(t) * .15);
        text(0, 25, 'CIPHER ' + (i + 1), 8, '#c3afce');
        c.restore();
    }
    c.save();
    c.translate(-cameraX, -cameraY);
    c.fillStyle = '#2a2538';
    c.fillRect(0, 0, COLS * T, ROWS * T);
    for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++) {
            const hash = (x * 17 + y * 31) % 11;
            if (!walls.has(x + ',' + y)) {
                c.fillStyle = ['#353040', '#383242', '#3a3444'][hash % 3];
                c.fillRect(x * T + 1, y * T + 1, T - 2, T - 2);
                line([[x * T + 3, y * T + T - 3], [x * T + T - 4, y * T + T - 3]], '#494052', .6);
                if (hash < 3) {
                    oval(x * T + 9, y * T + 13, 2, 1, '#84739455');
                    oval(x * T + 27, y * T + 29, 1.4, 1, '#a78ab344');
                }
                if (hash === 4) {
                    line([[x * T + 8, y * T + T], [x * T + 9, y * T + T - 8]], '#58614f', 1);
                    oval(x * T + 10, y * T + T - 7, 2, 2, '#a78acc');
                }
            }
        }
    // A softly lit fountain gives the western courtyard a landmark.
    c.save();
    c.translate(260, 410);
    shadow(0, 13, 28);
    oval(0, 4, 25, 13, '#6c5b7b');
    oval(0, 1, 21, 10, '#566074');
    oval(0, 0, 17, 8, '#766f9c');
    for (let i = 0; i < 3; i++) {
        c.strokeStyle = '#c4bce044';
        c.lineWidth = 1;
        c.beginPath();
        c.ellipse(0, 0, 4 + (t * 4 + i * 5) % 15, 2 + (t * 2 + i * 2.5) % 7, 0, 0, Math.PI * 2);
        c.stroke();
    }
    box(-4, -21, 8, 22, 2, '#9d85ae');
    oval(0, -22, 12, 4, '#bb9fcc');
    glow(0, -22, 38, '#b995f333');
    c.restore();
    // Blockers are raised, layered hedges instead of flat tiles.
    for (const key of walls) {
        const [x, y] = key.split(',').map(Number), px = x * T, py = y * T;
        if (px < cameraX - T || px > cameraX + W + T || py < cameraY - T || py > cameraY + H + T)
            continue;
        box(px + 1, py + 2, T - 2, T - 1, 4, '#211e30');
        box(px + 2, py - 4, T - 4, T - 6, 7, '#51435e');
        for (let k = 0; k < 4; k++) {
            const dx = 7 + (k % 2) * 19, dy = 3 + Math.floor(k / 2) * 15;
            oval(px + dx, py + dy, 10, 7, (x + y + k) % 2 ? '#665271' : '#70597b');
        }
        line([[px + 7, py - 2], [px + T - 8, py - 2]], '#94779e55', 1);
    }
    for (const [x, y] of [[2, 2], [6, 8], [15, 3], [22, 11], [12, 15]]) {
        const px = (x + .5) * T, py = (y + .5) * T, flame = 1 + Math.sin(t * 6 + x) * .15;
        glow(px, py - 24, 50, '#e6c18c20');
        line([[px, py + 8], [px, py - 24]], '#766378', 3);
        box(px - 5, py - 28, 10, 13, 2, '#5a445f', '#b99ab5');
        oval(px, py - 22, 3 * flame, 5, '#e3c49b');
        oval(px, py - 23, 1.6, 3, '#ffe5b5');
    }
    // The gate is a visible landmark, opening after the objectives are complete.
    c.save();
    c.translate(gate.x, gate.y);
    glow(0, -8, 60, rescued && machines.every(m => m.progress >= 40) ? '#d8b0ff44' : '#9976be22');
    const gateReady = rescued && machines.every(m => m.progress >= 40);
    for (const side of [-1, 1]) {
        box(side * 23 - 4, -43, 8, 58, 3, '#7e688e', '#b49ac5');
        oval(side * 23, -44, 6, 4, '#c4a5d4');
    }
    c.strokeStyle = '#b096c4';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(0, -22, 24, Math.PI, Math.PI * 2);
    c.stroke();
    for (let j = -2; j <= 2; j++)
        line([[j * 8, -22], [j * 8, 13]], gateReady ? '#ccb1ed88' : '#8e779f', 2);
    text(0, -52, '☾', 23, '#e4d5fa');
    text(0, 30, 'MOON GATE', 8);
    c.restore();
    pallets.forEach(p => {
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.down ? .2 : -.35);
        shadow(0, 9, 23);
        for (let j = 0; j < 4; j++)
            box(-20, -12 + j * 6, 40, 5, 1, p.down ? '#96809b' : '#907285', '#c4a5b355');
        line([[-14, -10], [14, 10]], '#c6a3b0', 2);
        c.restore();
    });
    machines.forEach(machineArt);
    if (!peanutFound) {
        c.save();
        c.translate(peanut.x, peanut.y);
        c.rotate(-.48);
        shadow(0, 5, 9);
        oval(0, -4, 5.5, 7.5, '#c99c66');
        oval(0, 5, 6.5, 8, '#d8b17a');
        line([[-2, -9], [-1, -3], [-2, 7]], '#9e734d', .8);
        for (let j = -6; j < 11; j += 4)
            line([[1, j], [4, j + 1]], '#efd09a', 1);
        c.restore();
        star(peanut.x + 10, peanut.y - 12, 2.2 + Math.sin(t * 3), '#f0d2a1', t * .3);
        if (Math.hypot(player.x - peanut.x, player.y - peanut.y) < 110)
            text(peanut.x, peanut.y - 21, 'A CRUNCHY FIND', 8, '#ead0aa');
    }
    for (const item of treasures) {
        if (item.claimed || !item.id)
            continue;
        c.save();
        c.translate(item.x, item.y);
        glow(0, 0, 32, '#e8c1ff33');
        box(-13, -13, 26, 27, 5, '#a782b9', '#dbc2ed');
        const picture = window.CarnivalManor?.images?.get(item.id);
        if (picture?.complete && picture.naturalWidth)
            c.drawImage(picture, -15, -28, 30, 32);
        else
            star(0, -6, 6, '#efdcff', t * .2);
        star(16, -23, 2 + Math.sin(t * 3 + item.index), '#f2d5a6', t);
        text(0, 25, 'TREASURE', 7, '#e0c8ee');
        c.restore();
    }
    if (!rescued) {
        glow(bear.x, bear.y, 35, '#d7b5ef28');
        plush(bear.x, bear.y);
        text(bear.x, bear.y - 25, 'RESCUE', 8);
    }
    // Sort the actors by their feet so passing them has depth.
    const actors = [{ y: player.y, draw: () => { c.globalAlpha = invincible > 0 && Math.floor(t * 8) % 2 === 0 ? .5 : 1; espurrActor(player); c.globalAlpha = 1; } }, { y: hunter.y, draw: () => annActor(hunter) }];
    actors.sort((a, b) => a.y - b.y).forEach(a => a.draw());
    if (rescued)
        plush(player.x - 25, player.y + 18);
    for (const effect of effects) {
        const f = 1 - effect.life / effect.duration;
        c.globalAlpha = Math.max(0, 1 - f);
        if (effect.kind === 'stun') {
            c.strokeStyle = '#e1b9ff';
            c.lineWidth = 3 - f * 2;
            c.beginPath();
            c.arc(effect.x, effect.y, 10 + f * 130, 0, Math.PI * 2);
            c.stroke();
        }
        else {
            for (let n = 0; n < 7; n++)
                star(effect.x + Math.cos(n) * f * 32, effect.y - 20 + Math.sin(n) * f * 26, 3, '#eed0ff', f);
        }
        c.globalAlpha = 1;
    }
    for (let i = 0; i < 20; i++) {
        const x = (i * 73 + Math.sin(t * .27 + i) * 22) % (COLS * T), y = (i * 137 + t * (2 + i % 3)) % (ROWS * T);
        const alpha = .3 + .25 * Math.sin(t * 1.6 + i);
        glow(x, y, 7, '#cbb0f525');
        oval(x, y, 1.1, 1.1, 'rgba(217,193,244,' + alpha + ')');
    }
    c.restore();
    // Light falloff and a chase pulse keep the interface readable without hiding the map.
    const vignette = c.createRadialGradient(W / 2, H * .47, Math.min(W, H) * .2, W / 2, H * .47, Math.max(W, H) * .65);
    vignette.addColorStop(0, '#110d1900');
    vignette.addColorStop(1, chase ? '#632d4944' : '#100c1b88');
    c.fillStyle = vignette;
    c.fillRect(0, 0, W, H);
    const goals = [...machines.filter(m => m.progress < 40).map((m, i) => ({ ...m, name: String(i + 1) })), ...(!rescued ? [{ ...bear, name: '◆' }] : []), ...(gateReady ? [{ ...gate, name: '☾' }] : [])];
    goals.forEach(g => {
        const x = g.x - cameraX, y = g.y - cameraY;
        if (x > 30 && x < W - 30 && y > 35 && y < H - 35)
            return;
        const px = Math.max(22, Math.min(W - 22, x)), py = Math.max(52, Math.min(H - 30, y));
        oval(px, py, 12, 12, '#24162bdd');
        c.strokeStyle = '#b391c6';
        c.lineWidth = 1;
        c.beginPath();
        c.arc(px, py, 12, 0, Math.PI * 2);
        c.stroke();
        text(px, py + 3, g.name, 10);
    });
    if (calibration) {
        const warning = calibration.phase === 'warning';
        const cx = W / 2, cy = H - Math.min(83, H * .21), r = 39;
        glow(cx, cy, 75, '#1b102de6');
        oval(cx, cy, r + 13, r + 13, '#20162dea');
        c.strokeStyle = '#6c547f';
        c.lineWidth = 6;
        c.beginPath();
        c.arc(cx, cy, r, 0, Math.PI * 2);
        c.stroke();
        if (!warning) {
            const start = -Math.PI / 2 + calibration.direction * calibration.zoneStart * Math.PI * 2;
            const end = -Math.PI / 2 + calibration.direction * (calibration.zoneStart + calibration.zoneWidth) * Math.PI * 2;
            c.strokeStyle = '#e5cb91';
            c.lineWidth = 7;
            c.beginPath();
            c.arc(cx, cy, r, start, end, calibration.direction < 0);
            c.stroke();
            const f = calibration.elapsed / calibration.duration, a = -Math.PI / 2 + calibration.direction * f * Math.PI * 2;
            line([[cx, cy], [cx + Math.cos(a) * (r - 4), cy + Math.sin(a) * (r - 4)]], '#fff2ff', 2.5);
            oval(cx, cy, 4, 4, '#f8e8ff');
            text(cx, cy + r + 26, 'TAP INTERACT · E', 9, '#ead5fb');
        }
        else {
            star(cx, cy, 10 + Math.sin(t * 12) * 2, '#e3c08d');
            text(cx, cy + r + 25, 'CHECK INCOMING', 9, '#ead5fb');
        }
    }
    // Tiny route map. Blocks, objectives and moving actors share the same coordinates.
    const mw = Math.min(104, W * .25), mh = mw * ROWS / COLS, mx = W - mw - 12, my = H - mh - 12;
    box(mx - 5, my - 5, mw + 10, mh + 10, 7, '#171020c9', '#a580b13d');
    const unit = mw / COLS;
    c.fillStyle = '#80628c77';
    for (const key of walls) {
        const [x, y] = key.split(',').map(Number);
        c.fillRect(mx + x * unit, my + y * unit, unit, unit);
    }
    machines.forEach(m => oval(mx + m.x / T * unit, my + m.y / T * unit, 2, 2, m.progress >= 40 ? '#a9d6b0' : '#e3c394'));
    oval(mx + player.x / T * unit, my + player.y / T * unit, 2.5, 2.5, '#f4dcff');
    if (chase)
        oval(mx + hunter.x / T * unit, my + hunter.y / T * unit, 2.5, 2.5, '#f3a7c6');
}
