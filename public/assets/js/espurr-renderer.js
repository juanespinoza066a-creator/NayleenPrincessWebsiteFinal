/* The approved Espurr costumes share the same animated body and walk cycle. */
const ESPURR_ART_SCALE = .68;
const ESPURR_POSE_SIZE = {width:68,height:72,x:32,y:60,density:2};
const ESPURR_POSE_LIMIT = 80;
const espurrPoses = new Map();

function drawPrincessEspurr(c, p, time, outfit = 'royal', repairing = false) {
    const stride = p.moving ? Math.sin(p.walk || 0) : 0;
    const bob = p.moving ? Math.abs(stride) * 1.5 : Math.sin(time * 2) * .6;
    const step = Math.round(stride * 4);
    const facing = Math.sign(p.facing || 0);
    const rear = p.facingY === -1;
    const blink = !rear && Math.sin(time * .7 + 1) > .997;
    const flutter = outfit === 'weather-wind' ? Math.round(Math.sin(time * 5)) * 3 : 0;
    const pose = {step:step / 4,facing,rear,blink,flutter};
    const key = [outfit,step,facing,Number(rear),Number(blink),flutter].join(':');
    const image = espurrPoseImage(key, pose, outfit);

    c.save();
    c.translate(p.x, p.y);
    c.fillStyle = '#16101c55';
    c.beginPath();
    c.ellipse(0, 7, 15, 4, 0, 0, Math.PI * 2);
    c.fill();
    c.translate(0, -bob * ESPURR_ART_SCALE);
    if (image) {
        const {width,height,x,y} = ESPURR_POSE_SIZE;
        c.drawImage(image, -x, -y, width, height);
    } else {
        drawEspurrPose(c, pose, outfit);
    }
    if (repairing) {
        const x = 18, y = -18 + Math.sin(time * 13) * 2;
        c.scale(ESPURR_ART_SCALE, ESPURR_ART_SCALE);
        c.fillStyle = '#f2d4ff';
        c.beginPath();
        c.moveTo(x, y - 4);
        c.lineTo(x + 1, y - 1);
        c.lineTo(x + 4, y);
        c.lineTo(x + 1, y + 1);
        c.lineTo(x, y + 4);
        c.lineTo(x - 1, y + 1);
        c.lineTo(x - 4, y);
        c.lineTo(x - 1, y - 1);
        c.closePath();
        c.fill();
    }
    c.restore();
}

function espurrPoseImage(key, pose, outfit) {
    const cached = espurrPoses.get(key);
    if (cached) {
        espurrPoses.delete(key);
        espurrPoses.set(key, cached);
        return cached;
    }
    if (typeof document === 'undefined') return null;
    const {width,height,x,y,density} = ESPURR_POSE_SIZE;
    const canvas = document.createElement('canvas');
    canvas.width = width * density;
    canvas.height = height * density;
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.scale(density, density);
    context.translate(x, y);
    drawEspurrPose(context, pose, outfit);
    if (espurrPoses.size >= ESPURR_POSE_LIMIT) espurrPoses.delete(espurrPoses.keys().next().value);
    espurrPoses.set(key, canvas);
    return canvas;
}

function drawEspurrPose(c, {step,facing,rear,blink,flutter}, outfit) {
    c.save();
    const oval = (x, y, rx, ry, color) => { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fillStyle = color; c.fill(); };
    const path = (points, color, stroke) => { c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fillStyle = color; c.fill(); if (stroke) {
        c.strokeStyle = stroke;
        c.lineWidth = 1;
        c.stroke();
    } };
    const line = (points, color, width = 1) => { c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.stroke(); };
    c.scale(ESPURR_ART_SCALE, ESPURR_ART_SCALE);
    // Small feet and a fluffy pear silhouette keep the head much larger than the body.
    const boots = {
        'weather-snow': '#749ad5',
        'weather-night': '#3c3a74',
        'espurr-xmas': '#9d243a',
        'damon-outfit': '#241e2d',
        'cartman-outfit': '#675344',
        'hitler-espurr': '#343137'
    }[outfit];
    for (const side of [-1, 1]) {
        const footY = 1 - side * step * 3;
        oval(side * 7, footY, 5, 7, boots || '#bfb0ce');
        if (outfit === 'weather-snow' || outfit === 'weather-night' || outfit === 'espurr-xmas') {
            line([[side * 7 - 3, footY], [side * 7 + 3, footY]], '#e7dcec', 1.7);
        }
    }
    if (outfit === 'espeon') {
        line([[10, -4], [24, -5], [29, -16], [33, -22]], '#b59acb', 4);
        line([[29, -16], [38, -16]], '#b59acb', 4);
    }
    oval(0, -13, 14, 19, '#c8bad8');
    path([[-12, -22], [-18, -16], [-13, -14], [-18, -6], [-11, -7], [-14, 0], [-6, -2], [0, 4], [8, -2], [14, 0], [12, -8], [18, -6], [14, -15], [17, -17], [11, -23]], '#c8bad8');
    const colors = {
        'weather-sun': ['#f1ad70', '#ffe495'],
        'weather-cloud': ['#9997d4', '#dfd6f8'],
        'weather-rain': ['#f6d471', '#aa85d1'],
        'weather-storm': ['#76478e', '#e5ba69'],
        'weather-wind': ['#82b2a7', '#d7f2d9'],
        'weather-cold': ['#d983a5', '#f3dbdb'],
        'weather-snow': ['#94b9ea', '#eaf2ff'],
        'weather-night': ['#45447f', '#e5c170'],
        'espurr-xmas': ['#b42c45', '#fff1ec'],
        jubilee:['#e9c44f','#dd70ab'],'jubilee-midnight':['#343142','#b3a8ca'],rafayel:['#e8e4e9','#83b9d6'],'pokemon-pack':['#90afd7','#e8ca77'],firestarter:['#ae3949','#e5b5cd'],reze:['#e6e6ed','#6b4b7e'],cissia:['#34344b','#d95174'],ada: ['#9ca4b7', '#525569'], rogue: ['#36875b', '#f3d063'], furina: ['#46598d', '#d9e4ff'], kda: ['#55417b', '#d8b36b'], sunday: ['#8d9dc1', '#e9d6a2'], espeon: ['#b89bd0', '#ddc7ed'], akali: ['#6a526e', '#8bc7b7'], ribbon: ['#d6a0de', '#f6d2ee'], cozy: ['#d2ad7e', '#f0d6b0'], hearts: ['#794467', '#efbdcd'], garden: ['#d8accd', '#a28b9c'], moon: ['#6e5a96', '#d1b6ec'], starlight: ['#bb9bdf', '#eed9b1'] };
    if (outfit === 'weather-wind') {
        path([[10,-24],[24,-23],[40,-28 + flutter],[37,-17 + flutter],[25,-13],[12,-17]], '#a884c8', '#d6bbea');
        line([[24,-20],[35,-22 + flutter]], '#dbc8ed', 1.5);
    }
    if (outfit === 'damon-outfit' || outfit === 'hitler-espurr') {
        const jacket = outfit === 'damon-outfit' ? '#36303e' : '#887b58';
        const lapel = outfit === 'damon-outfit' ? '#5c5267' : '#aa9b73';
        path([[-12,-24],[12,-24],[17,-17],[13,1],[-13,1],[-17,-17]], jacket, '#514650');
        path([[-9,-24],[0,-15],[9,-24],[2,-9],[-2,-9]], lapel);
        path([[-5,-24],[0,-19],[5,-24],[0,-15]], '#e5dce5');
        line([[0,-17],[0,-1]], '#292530', 1.4);
        for (const y of [-13,-8,-3]) oval(2, y, 1, 1, lapel);
        if (outfit === 'damon-outfit') line([[-8,-13],[-4,-15]], '#ae9ab5', 1.2);
    }
    if (outfit === 'cartman-outfit') {
        path([[-11,-24],[11,-24],[18,-15],[15,2],[0,5],[-15,2],[-18,-15]], '#ce3d46', '#8c2d40');
        line([[-14,-8],[0,-6],[14,-8]], '#ea6767', 1.5);
        line([[-12,-1],[0,1],[12,-1]], '#a62c3d', 1.5);
        for (const y of [-15,-9,-3]) oval(0, y, 1.4, 1.4, '#633a43');
    }
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
            if (outfit === 'weather-sun') {
                path([[-15,-11],[0,-7],[15,-11],[18,-5],[0,0],[-18,-5]], '#fbd59b');
                for (const x of [-11, 0, 11]) oval(x, -6, 2.2, 2.2, '#fff0c0');
                oval(9, -17, 3.4, 3.4, '#f9d767');
                oval(9, -17, 1.5, 1.5, '#bf7844');
            }
            if (outfit === 'weather-cloud') {
                for (const x of [-10, 10]) line([[x,-20],[x,-4]], '#c1b9e8', 1.4);
                line([[-8,-19],[13,-7]], '#e1c7a4', 2);
                for (const y of [-17,-12,-7]) oval(-1, y, 1.2, 1.2, '#eee4ff');
                oval(11, -5, 6, 3, '#fff3e3');
                oval(8, -7, 3, 3, '#fff3e3');
                oval(13, -8, 3, 4, '#fff3e3');
            }
            if (outfit === 'weather-rain') {
                for (const y of [-16, -10]) oval(0, y, 1.7, 1.7, '#a77b62');
                line([[-10,-8],[-6,-9]], '#fff0b7', 2);
                line([[6,-9],[10,-8]], '#fff0b7', 2);
                path([[-2,-24],[-10,-27],[-8,-20],[-2,-22],[5,-19],[8,-26]], '#b989d8');
            }
            if (outfit === 'weather-storm') {
                line([[0,-22],[0,3]], '#e8c37d', 1);
                path([[3,-22],[-3,-13],[2,-13],[-2,-5],[8,-16],[3,-16]], '#ffe2a0');
                oval(-11, -4, 1.5, 1.5, '#e9ba7d');
                oval(11, -4, 1.5, 1.5, '#e9ba7d');
            }
            if (outfit === 'weather-wind') {
                line([[-12,-24],[0,-21],[12,-24]], '#ad8bd1', 4);
                line([[-9,-18],[-6,-15],[-3,-18]], '#daf1e0', 1.5);
                line([[3,-10],[6,-7],[9,-10]], '#daf1e0', 1.5);
            }
            if (outfit === 'weather-cold' || outfit === 'espurr-xmas') {
                line([[0,-20],[0,4]], trim, 2.8);
                line([[-14,0],[0,5],[14,0]], trim, 3);
                for (const y of [-16,-10,-4]) oval(2, y, 1, 1, '#ffe3b0');
                if (outfit === 'espurr-xmas') {
                    path([[-9,-23],[-3,-21],[0,-23],[3,-21],[9,-23],[7,-17],[0,-20],[-7,-17]], '#bc8acb');
                }
            }
            if (outfit === 'weather-snow') {
                line([[-12,-23],[0,-17],[12,-23]], '#f4f9ff', 3.2);
                line([[-15,-3],[-9,0],[0,1],[9,0],[15,-3]], '#f7faff', 2.7);
                for (const [x,y] of [[-8,-11],[0,-15],[8,-11]]) {
                    line([[x-2,y],[x+2,y]], '#fffaff', 1);
                    line([[x,y-2],[x,y+2]], '#fffaff', 1);
                }
            }
            if (outfit === 'weather-night') {
                for (const [x,y] of [[-8,-13],[8,-8],[-10,-2]]) {
                    path([[x-3,y],[x-1,y-1],[x,y-4],[x+1,y-1],[x+3,y],[x+1,y+1],[x,y+3],[x-1,y+1]], '#f6d690');
                }
                line([[-11,-23],[0,-19],[11,-23]], '#f4d9b2', 2);
                line([[0,-19],[0,2]], '#e7be72', 1.5);
            }
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
    if (outfit === 'cartman-outfit') {
        oval(-11, -10 + step, 4.3, 4.5, '#ffdd66');
        oval(11, -10 - step, 4.3, 4.5, '#ffdd66');
    }
    // Rounded folded ears hug the sides of the head, rather than pointing upwards.
    c.save();
    c.translate(facing * .5, 0);
    if (outfit === 'weather-storm') {
        oval(0, -48, 36, 26, '#583067');
        oval(0, -48, 32, 23, '#d5ab69');
        oval(0, -48, 30, 21, '#8d5ba5');
    }
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
    if (!rear) {
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
    if (outfit === 'weather-sun') {
        oval(0, -60, 34, 7, '#efd8a5');
        path([[-25,-61],[-20,-70],[-7,-74],[10,-74],[23,-68],[26,-61],[0,-58]], '#f8dda2', '#cca66b');
        line([[-25,-62],[0,-60],[25,-62]], '#bc8fce', 4);
        path([[18,-62],[24,-68],[30,-60],[24,-59],[31,-54],[24,-54]], '#ca9dda');
        oval(-17, -64, 4, 4, '#ffe373');
        oval(-17, -64, 1.5, 1.5, '#ba7c44');
    }
    if (outfit === 'weather-rain') {
        line([[34,-68],[25,-21],[21,-20]], '#c5a2da', 2);
        path([[8,-65],[17,-77],[29,-82],[41,-77],[48,-65],[41,-66],[34,-62],[27,-66],[19,-63],[15,-67]], '#b790d8', '#e4cafa');
        line([[29,-81],[26,-74],[27,-66]], '#e5d0ef', 1);
    }
    if (outfit === 'weather-cold') {
        path([[-24,-58],[-22,-68],[-14,-76],[0,-79],[13,-76],[21,-68],[25,-58]], '#ba8fca', '#9e77ae');
        oval(-2,-80,7,6,'#e9cceb');
        line([[-23,-59],[0,-62],[24,-59]], '#dfbce3', 5);
        for (const x of [-16,-9,9,16]) line([[x,-57],[x,-62]], '#a980b5', 1.2);
    }
    if (outfit === 'weather-night') {
        path([[-24,-58],[-11,-73],[4,-82],[19,-80],[30,-66],[32,-58],[24,-63],[8,-63],[-8,-59]], '#47447e', '#ddba77');
        line([[-24,-58],[0,-61],[24,-59]], '#f7dfba', 3.6);
        oval(29,-57,5,5,'#efdfc7');
        oval(10,-72,4.5,4.5,'#edc970');
        oval(12,-74,3.5,3.5,'#47447e');
        for (const [x,y] of [[-8,-69],[0,-75],[18,-68]]) oval(x,y,1,1,'#f3d08b');
    }
    if (outfit === 'cartman-outfit') {
        path([[-27,-53],[-23,-65],[-11,-73],[6,-74],[20,-67],[26,-54],[12,-60],[-12,-60]], '#479eb4', '#34748d');
        line([[-26,-53],[-15,-58],[0,-61],[14,-58],[26,-53]], '#f6d05e', 3.6);
        oval(0,-76,9,5,'#ecc651');
    }
    if (outfit === 'hitler-espurr') {
        path([[-19,-61],[-12,-69],[1,-71],[13,-67],[18,-60],[21,-52],[12,-55],[3,-60],[-4,-63],[-13,-59]], '#483b38', '#302b2d');
        line([[-4,-65],[3,-64],[12,-61],[17,-57]], '#776363', 1.1);
        if (!rear) path([[-3,-31],[3,-31],[3,-28],[-3,-28]], '#483b38');
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
    if (outfit !== 'weather-night' && outfit !== 'cartman-outfit' && outfit !== 'hitler-espurr') {
        c.save();
        c.translate(0, -65);
        path([[-13, 2], [-15, -9], [-7, -5], [0, -18], [7, -5], [15, -9], [13, 2]], '#dabb82', '#ab8b5c');
        line([[-12, 1], [12, 1]], '#ffdda0', 2);
        oval(0, -6, 3, 4, '#b48bd3');
        for (const [x, y] of [[-15, -10], [0, -19], [15, -10]])
            oval(x, y, 2, 2, '#efcf8e');
        c.restore();
    }
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
    c.restore();
}
