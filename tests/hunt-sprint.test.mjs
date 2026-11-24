import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';

const root = process.env.HUNT_BRANCH_UNDER_TEST || new URL('../public/', import.meta.url).pathname;
const {window, document} = parseHTML(fs.readFileSync(root + '/escape.html', 'utf8'));
for (const dialog of document.querySelectorAll('dialog')) dialog.showModal = () => {dialog.open = true;};
document.getElementById('world').getContext = () => ({});
const sprintButton = document.getElementById('sprint');
sprintButton.setPointerCapture = () => {};
const context = vm.createContext({window, document, console, Math, requestAnimationFrame: () => {}, location: {href: ''}, Image: class {}, setTimeout, clearTimeout});
vm.runInContext(fs.readFileSync(root + '/assets/js/manor-game.js', 'utf8') + `
globalThis.test = {
    prepare() {
        state = 'playing';
        elapsed = 0;
        stamina = 2;
        hp = 3;
        player = {x: 100, y: 400, facing: 1};
        hunter = {x: 900, y: 600};
        stunned = 20;
        walls.clear();
        joy = {x: 1, y: 0};
        keys.clear();
        sprinting = sprintExhausted = false;
    },
    update,
    get stamina() {return stamina;},
    get x() {return player.x;}
};
`, context);

const game = context.test;
function input(target, type, key) {
    const event = new window.Event(type);
    if (key) event.key = key;
    else event.pointerId = 1;
    target.dispatchEvent(event);
}
function frame(expectedPace, dt = .05) {
    const start = game.x;
    game.update(dt);
    assert(Math.abs(game.x - start - expectedPace * dt) < .01);
}
for (const [target, down, up, key] of [
    [sprintButton, 'pointerdown', 'pointerup'],
    [sprintButton, 'pointerdown', 'pointercancel'],
    [window, 'keydown', 'keyup', 'Shift'],
]) {
    game.prepare();
    input(target, down, key);
    frame(174);
    frame(174);
    assert.equal(game.stamina, 0);
    for (let i = 0; i < 20; i++) frame(112);
    assert(game.stamina > 20, 'Stamina can recover while walking');
    input(target, up, key);
    input(target, down, key);
    frame(174);
    input(target, up, key);
}
game.prepare();
input(window, 'keydown', 'Shift');
input(sprintButton, 'pointerdown');
frame(174);
frame(174);
input(sprintButton, 'lostpointercapture');
frame(112);
frame(112);
input(window, 'keyup', 'Shift');
input(sprintButton, 'pointerdown');
frame(174);
console.log('PASS: exhaustion holds sprint at walking speed until all sprint inputs are released, then a new press works.');
