// The dialog owns the only vertical scroll area. Cards flow together in a grid.
export function attachTradeScroll(grid){
 const frame=document.createElement('section');frame.className='treasure-browser';frame.setAttribute('aria-label','Choose your treasures');grid.before(frame);
 const hint=document.createElement('p');hint.className='treasure-scroll-hint';hint.textContent='Your treasures · scroll down for more ↓';grid.setAttribute('aria-label','Treasure collection');frame.append(hint,grid);
 const dialog=grid.closest('dialog');dialog?.classList.add('treasure-dialog');
 const body=grid.closest('#game-body');
 for(const rule of body?.querySelectorAll(':scope > .rules')||[]){const help=document.createElement('details'),summary=document.createElement('summary');help.className='treasure-help';summary.textContent='How this wish works';rule.before(help);help.append(summary,rule);}
 return frame;
}
