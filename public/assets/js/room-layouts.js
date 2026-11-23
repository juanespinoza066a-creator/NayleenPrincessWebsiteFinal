// Bounding boxes are percentages of the displayed room, with the item grounded
// at the bottom of its box. Shared by the live room, exported PNG and widget snapshot.
// Art anchors are the horizontal center and baseline on the pictured surface.
// Derive the clickable rectangles from those anchors so sprites sit on the surface.
const ANCHORS = {
    lavender: [[13,93,15,29,'left floor'],[28,96,13,25,'left cushion'],[73,96,14,27,'right cushion'],[90,91,13,24,'right floor']],
    cafe: [[13,47,10,16,'left counter'],[39,41,9,16,'coffee counter'],[75,53,9,16,'patio ground'],[93,50,10,17,'patio chair']],
    garden: [[15,46,10,18,'garden bench'],[31,72,12,19,'lawn'],[76,42,10,17,'gazebo step'],[87,80,12,20,'lawn edge']],
    cards: [[13,59,10,17,'left display counter'],[30,49,9,16,'lower shop shelf'],[72,38,10,17,'back counter'],[90,64,10,17,'right display counter']],
    popmart: [[13,55,10,17,'toy shelf'],[23,49,10,18,'window seat'],[80,51,11,19,'cash counter'],[91,79,11,19,'shop floor']],
    sunday: [[12,51,10,18,'left chaise'],[30,46,10,17,'tea table'],[83,48,10,18,'right chaise'],[92,76,10,18,'lower display']],
    gambit: [[15,59,11,18,'bedspread'],[36,52,10,17,'desk'],[74,54,10,18,'bookcase top'],[89,69,10,17,'lower display shelf']],
    minecraft: [[12,49,10,17,'wooden shelf'],[33,64,10,19,'left rug edge'],[75,54,10,16,'window seat'],[90,55,10,17,'right bench']],
    manor: [[9,55,10,17,'writing table'],[30,71,10,17,'left floor'],[86,57,10,18,'sofa seat'],[71,54,10,17,'tea table']],
    restaurant: [[10,59,10,16,'left step'],[21,36,9,15,'left dining table'],[76,53,10,17,'booth seat'],[90,65,10,17,'round side seat']],
    'christmas-room': [[10,66,10,17,'left side table'],[34,51,11,18,'sofa seat'],[74,56,10,17,'gift stack'],[90,65,10,17,'right tea table']],
    'damon-room': [[11,53,10,17,'reading table'],[35,48,10,17,'sofa cushion'],[77,49,10,18,'fireplace ottoman'],[92,61,10,18,'serving table']],
    'cartman-room': [[9,62,10,18,'bedside table'],[32,54,10,17,'bedspread'],[65,55,10,18,'window seat'],[93,67,10,17,'writing desk']],
    'german-command-bunker': [[15,73,11,17,'left foreground desk'],[15,55,10,15,'left side desk'],[84,55,10,15,'right side desk'],[87,73,12,17,'right foreground desk']],
    hotpot: [[11,54,10,17,'left chair'],[30,45,10,17,'booth cushion'],[70,46,10,17,'booth cushion by the window'],[93,59,10,17,'right chair']]
};
export const ROOM_PLACEMENTS = Object.fromEntries(Object.entries(ANCHORS).map(([room, slots]) =>
    [room, slots.map(([cx, base, width, height, label]) => [cx - width / 2, base - height, width, height, label])]
));
export function placeCollectibles(room,id){if(room.dataset.furniture!=='true')room.dataset.furniture='true';const layout=ROOM_PLACEMENTS[id]||ROOM_PLACEMENTS.lavender;room.querySelectorAll('.stage-slot').forEach((slot,i)=>{if(slot.dataset.placement===id)return;slot.dataset.placement=id;const [x,y,w,h,label]=layout[i%4];Object.assign(slot.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%',right:'auto',bottom:'auto'});slot.setAttribute('aria-label',(slot.querySelector('img')?.alt||'Place a collectible')+' · '+label);});}
