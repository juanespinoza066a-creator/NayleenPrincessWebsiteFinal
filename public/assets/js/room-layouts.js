// Bounding boxes are percentages of the displayed room, with the item grounded
// at the bottom of its box. Shared by the live room, exported PNG and widget snapshot.
export const ROOM_PLACEMENTS={
 lavender:[[6,64,15,29,'left display'],[23,71,13,25,'low cushion'],[71,69,14,27,'right cushion'],[85,57,13,27,'side display']],
 cafe:[[7,25,13,23,'left counter'],[25,23,12,23,'café counter'],[76,28,12,23,'garden chair'],[84,59,13,27,'flower-side display']],
 garden:[[8,35,13,24,'garden bench'],[23,48,12,24,'lily path'],[74,34,12,24,'gazebo seat'],[85,64,13,25,'garden edge']],
 cards:[[6,26,12,24,'left card counter'],[26,31,11,21,'shop display'],[74,25,12,24,'right card counter'],[86,56,12,25,'display case']],
 popmart:[[7,26,12,23,'left toy shelf'],[26,29,11,23,'display counter'],[76,27,11,23,'right toy shelf'],[85,59,13,26,'low display']],
 sunday:[[6,28,12,24,'left chaise'],[24,25,12,24,'tea-table edge'],[76,25,12,24,'right chaise'],[86,51,12,25,'piano-side display']],
 gambit:[[8,31,13,23,'bedside table'],[27,30,12,24,'desk chair'],[69,31,12,24,'bookcase cabinet'],[86,41,12,25,'right cabinet']],
 minecraft:[[5,27,12,23,'left block shelf'],[25,32,12,24,'crafting bench'],[75,34,12,24,'block chair'],[85,44,12,24,'right bench']],
 manor:[[4,31,12,24,'left writing table'],[16,29,12,24,'window seat'],[80,33,12,24,'sofa cushion'],[66,28,11,24,'tea table']],
 restaurant:[[2,36,13,23,'left step seat'],[15,15,11,23,'left dining table'],[76,30,12,25,'booth cushion'],[86,39,12,25,'round side seat']],
 'christmas-room':[[3,48,13,24,'left side table'],[28,31,12,24,'sofa cushion'],[72,35,12,24,'gift stack'],[85,46,12,24,'right tea table']],
 'damon-room':[[4,34,12,24,'left reading table'],[26,30,12,24,'sofa cushion'],[68,32,12,24,'fireplace ottoman'],[85,48,12,24,'right serving table']],
 'cartman-room':[[4,43,12,24,'bedside table'],[26,38,12,24,'bed cushion'],[63,32,12,24,'window seat'],[85,46,12,24,'writing desk']],
 hotpot:[[6,28,12,24,'left hotpot table'],[25,32,12,24,'pink chair'],[72,28,12,24,'right hotpot table'],[86,43,12,25,'right chair']]
};
export function placeCollectibles(room,id){if(room.dataset.furniture!=='true')room.dataset.furniture='true';const layout=ROOM_PLACEMENTS[id]||ROOM_PLACEMENTS.lavender;room.querySelectorAll('.stage-slot').forEach((slot,i)=>{if(slot.dataset.placement===id)return;slot.dataset.placement=id;const [x,y,w,h,label]=layout[i%4];Object.assign(slot.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%',right:'auto',bottom:'auto'});slot.setAttribute('aria-label',(slot.querySelector('img')?.alt||'Place a collectible')+' · '+label);});}
