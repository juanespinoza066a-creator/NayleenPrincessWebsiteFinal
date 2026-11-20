/* A small animated 2D puppet, drawn with Espurr's broad folded ears and round eyes. */
function drawPrincessEspurr(c, p, time, outfit = 'royal', repairing = false) {
    c.save();
    c.translate(p.x, p.y);
    const step = p.moving ? Math.sin(p.walk || 0) : 0, bob = p.moving ? Math.abs(step) * 1.5 : Math.sin(time * 2) * .6;
    const oval = (x, y, rx, ry, color) => { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fillStyle = color; c.fill(); };
    const path = (points, color, stroke) => { c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fillStyle = color; c.fill(); if (stroke) {
        c.strokeStyle = stroke;
        c.lineWidth = 1;
        c.stroke();
    } };
    const line = (points, color, width = 1) => { c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.stroke(); };
    oval(0, 7, 15, 4, '#16101c55');
    c.scale(.68, .68);
    c.translate(0, -bob);
    // Small feet and a fluffy pear silhouette keep the head much larger than the body.
    oval(-7, 1 + step * 3, 5, 7, '#bfb0ce');
    oval(7, 1 - step * 3, 5, 7, '#bfb0ce');
    if (outfit === 'espeon') {
        line([[10, -4], [24, -5], [29, -16], [33, -22]], '#b59acb', 4);
        line([[29, -16], [38, -16]], '#b59acb', 4);
    }
    oval(0, -13, 14, 19, '#c8bad8');
    path([[-12, -22], [-18, -16], [-13, -14], [-18, -6], [-11, -7], [-14, 0], [-6, -2], [0, 4], [8, -2], [14, 0], [12, -8], [18, -6], [14, -15], [17, -17], [11, -23]], '#c8bad8');
    const colors = { jubilee:['#e9c44f','#dd70ab'],'jubilee-midnight':['#343142','#b3a8ca'],rafayel:['#e8e4e9','#83b9d6'],'pokemon-pack':['#90afd7','#e8ca77'],firestarter:['#ae3949','#e5b5cd'],reze:['#e6e6ed','#6b4b7e'],cissia:['#34344b','#d95174'],ada: ['#9ca4b7', '#525569'], rogue: ['#36875b', '#f3d063'], furina: ['#46598d', '#d9e4ff'], kda: ['#55417b', '#d8b36b'], sunday: ['#8d9dc1', '#e9d6a2'], espeon: ['#b89bd0', '#ddc7ed'], akali: ['#6a526e', '#8bc7b7'], ribbon: ['#d6a0de', '#f6d2ee'], cozy: ['#d2ad7e', '#f0d6b0'], hearts: ['#794467', '#efbdcd'], garden: ['#d8accd', '#a28b9c'], moon: ['#6e5a96', '#d1b6ec'], starlight: ['#bb9bdf', '#eed9b1'] };
    if (outfit !== 'royal' && colors[outfit]) {
        const [base, trim] = colors[outfit];
        if (outfit === 'cozy') {
            path([[-12, -26], [12, -26], [17, -18], [12, -15], [11, 0], [-11, 0], [-12, -15], [-17, -18]], base, trim);
            oval(0, -13, 3.2, 5, '#ac7e50');
            oval(0, -6, 4, 5, '#bb8c5b');
            line([[-9, -1], [9, -1]], trim, 2);
        }
        else {
            path([[-12, -25], [12, -25], [13, -15], [20, 2], [0, 8], [-20, 2], [-13, -15]], base, trim);
            line([[-17, -1], [0, 4], [17, -1]], trim, 2);
            if (outfit === 'hearts') {
                path([[0, -5], [-6, -11], [-5, -15], [0, -12], [5, -15], [6, -11]], '#efb1c9');
            }
            else if (outfit === 'moon' || outfit === 'starlight') {
                for (const [x, y] of [[-10, -8], [8, -2], [1, -17]])
                    path([[x, y - 3], [x + 1, y - 1], [x + 3, y], [x + 1, y + 1], [x, y + 3], [x - 1, y + 1], [x - 3, y], [x - 1, y - 1]], '#f4d8a4');
            }
            else if (outfit === 'garden') {
                for (const x of [-8, 0, 8]) {
                    oval(x, -20, 3, 3, '#fae0ef');
                    oval(x, -20, 1, 1, '#d8ba84');
                }
            }
        }
    }
    oval(-13, -16 + step * 1.5, 4, 8, '#d0c3dd');
    oval(13, -16 - step * 1.5, 4, 8, '#d0c3dd');
    // Rounded folded ears hug the sides of the head, rather than pointing upwards.
    c.save();
    c.translate((p.facing || 0) * .5, Math.sin(time * 2.3) * .3);
    oval(0, -41, 23, 22, '#d0c2de');
    path([[-21, -43], [-27, -36], [-22, -35], [-28, -29], [-20, -30], [-23, -24], [-13, -27], [-7, -23], [0, -25], [7, -23], [13, -27], [23, -24], [20, -30], [28, -29], [22, -35], [27, -36], [21, -43]], '#d0c2de');
    for (const side of [-1, 1]) {
        c.save();
        c.scale(side, 1);
        c.rotate(step * .018);
        c.beginPath();
        c.moveTo(8, -57);
        c.bezierCurveTo(19, -71, 33, -57, 33, -37);
        c.quadraticCurveTo(30, -28, 17, -40);
        c.quadraticCurveTo(12, -45, 8, -57);
        c.fillStyle = '#b8a6c9';
        c.fill();
        c.strokeStyle = '#a694b9';
        c.lineWidth = 1;
        c.stroke();
        c.beginPath();
        c.moveTo(10, -57);
        c.bezierCurveTo(18, -67, 30, -54, 30, -42);
        c.quadraticCurveTo(26, -35, 17, -43);
        c.closePath();
        c.fillStyle = '#cec0dc';
        c.fill();
        c.beginPath();
        c.moveTo(13, -49);
        c.quadraticCurveTo(21, -39, 30, -39);
        c.strokeStyle = '#e6d8ee';
        c.lineWidth = 2;
        c.stroke();
        c.restore();
    }
    if (p.facingY !== -1) {
        const blink = Math.sin(time * .7 + 1) > .997;
        for (const x of [-9, 9]) {
            if (blink) {
                line([[x - 5, -40], [x + 5, -40]], '#9272a9', 1.4);
                continue;
            }
            const eye = c.createLinearGradient(0, -50, 0, -31);
            eye.addColorStop(0, '#9d73b8');
            eye.addColorStop(1, '#d8a4ed');
            oval(x, -39, 6.3, 8.2, eye);
            c.strokeStyle = '#8e66a7';
            c.lineWidth = .8;
            c.stroke();
            oval(x + 1.8, -43, 2.1, 2.4, '#fff6ff');
            oval(x - 2, -35, 1, 1.2, '#ecc6fb66');
        }
        oval(0, -32, .7, .8, '#76627f');
        c.beginPath();
        c.moveTo(-3, -62);
        c.bezierCurveTo(-15, -62, -6, -50, -7, -47);
        c.bezierCurveTo(2, -48, 9, -59, 4, -63);
        c.closePath();
        c.fillStyle = '#d8cce4';
        c.fill();
    }
    else {
        line([[-10, -31], [-6, -28], [-2, -30], [3, -27], [8, -31]], '#b9a7cc', 1);
    }
    if (outfit === 'espeon')
        oval(0, -58, 3, 4, '#ce749d');
    if (outfit === 'sunday') {
        c.strokeStyle = '#d4b87c';
        c.lineWidth = 2;
        c.beginPath();
        c.ellipse(0, -77, 20, 6, 0, 0, Math.PI * 2);
        c.stroke();
    }
    if (outfit === 'rogue') {
        line([[-22,-55],[0,-58],[22,-55]], '#328250', 5);
        path([[-5,-61],[-10,-52],[0,-56],[3,-48],[8,-61]], '#fcf2e4');
    }
    if (outfit === 'furina') {
        path([[3,-64],[0,-79],[19,-80],[23,-64]], '#364774', '#e4d4ab');
        line([[-2,-64],[27,-64]], '#92bfe7', 3);
        oval(15,-69,2,3,'#84c8f0');
    }
    if (outfit === 'kda') {
        path([[-22,-58],[-19,-68],[10,-70],[19,-62],[28,-58],[2,-57]], '#302a48', '#c8a868');
        c.save();c.translate(0,-62);c.scale(.55,.55);c.fillStyle='#e4c17c';c.font='bold 11px sans-serif';c.textAlign='center';c.fillText('K/DA',0,0);c.restore();
    }
    if(outfit==='jubilee'){oval(-9,-60,8,4,'#dc70af');oval(8,-60,8,4,'#d06cab');line([[-15,-59],[15,-59]],'#f4cfe6',1);}
    if(outfit==='jubilee-midnight')line([[-15,-23],[0,-19],[15,-23]],'#dad6ed',3);
    if(outfit==='firestarter'){path([[-19,-61],[-17,-70],[16,-70],[20,-61]],'#423743');line([[-18,-61],[20,-61]],'#e873b2',3);}
    if(outfit==='pokemon-pack'){path([[-13,-23],[13,-23],[13,2],[-13,2]],'#94aedb','#ead181');oval(0,-11,7,7,'#e1c5ed');line([[-10,-20],[10,-20]],'#ecdaa9',2);}
    if(outfit==='reze'){path([[-6,-24],[6,-24],[1,-14],[-1,-14]],'#514066');}
    if(outfit==='cissia')oval(0,-21,3,4,'#d09f64');
    // Gold crown and lavender ribbon match her portrait.
    c.save();
    c.translate(0, -65 + Math.sin(time * 2) * .5);
    path([[-13, 2], [-15, -9], [-7, -5], [0, -18], [7, -5], [15, -9], [13, 2]], '#dabb82', '#ab8b5c');
    line([[-12, 1], [12, 1]], '#ffdda0', 2);
    oval(0, -6, 3, 4, '#b48bd3');
    for (const [x, y] of [[-15, -10], [0, -19], [15, -10]])
        oval(x, y, 2, 2, '#efcf8e');
    c.restore();
    c.restore();
    if (outfit === 'akali' || outfit === 'kda')
        path([[-13, -27], [13, -27], [9, -19], [-6, -21], [-16, -15], [-12, -23]], outfit === 'kda' ? '#38314e' : '#64a99e');
    if (outfit === 'rogue') {
        path([[-14,-25],[-5,-24],[-7,-8],[-15,-8]], '#97623f');
        path([[14,-25],[5,-24],[7,-8],[15,-8]], '#97623f');
        oval(-13,-16,4,5,'#e8c958'); oval(13,-16,4,5,'#e8c958');
    }
    if (outfit === 'royal' || outfit === 'ribbon') {
        path([[-1, -24], [-11, -28], [-10, -18], [-1, -21], [0, -14], [3, -21], [11, -18], [11, -28], [2, -24]], outfit === 'ribbon' ? '#b67aca' : '#b18ac9');
        oval(1, -23, 3, 3, '#dfb8ee');
    }
    if (repairing) {
        c.save();
        c.translate(18, -18 + Math.sin(time * 13) * 2);
        path([[0, -4], [1, -1], [4, 0], [1, 1], [0, 4], [-1, 1], [-4, 0], [-1, -1]], '#f2d4ff');
        c.restore();
    }
    c.restore();
}
