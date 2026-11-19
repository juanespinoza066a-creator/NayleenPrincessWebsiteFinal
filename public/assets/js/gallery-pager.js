let serial=0;
// Keeps the existing tabbed galleries short as new rewards are added.
export function galleryPager(grid,label,pageSize=6){
 if(!grid)return;
 grid.id ||= 'palace-gallery-'+(++serial);
 const controls=document.createElement('div');controls.className='gallery-pager';
 const count=document.createElement('span');count.className='gallery-count';count.setAttribute('aria-live','polite');
 const more=document.createElement('button'),less=document.createElement('button');more.type=less.type='button';more.className=less.className='text-button';more.setAttribute('aria-controls',grid.id);less.setAttribute('aria-controls',grid.id);less.textContent='Show less';controls.append(count,more,less);grid.after(controls);let limit=pageSize;
 const update=()=>{const items=[...grid.children],visible=Math.min(limit,items.length);items.forEach((item,i)=>{item.classList.toggle('gallery-hidden',i>=limit);item.hidden=i>=limit;});count.textContent='Showing '+visible+' of '+items.length+' '+label;more.textContent='Show '+Math.min(pageSize,Math.max(0,items.length-limit))+' more';more.hidden=limit>=items.length;less.hidden=limit<=pageSize;more.setAttribute('aria-expanded',String(limit>pageSize));controls.hidden=items.length<=pageSize;};
 more.onclick=()=>{limit+=pageSize;update();if(more.hidden)less.focus({preventScroll:true});};less.onclick=()=>{limit=pageSize;update();more.focus({preventScroll:true});grid.scrollIntoView({block:'nearest'});};new MutationObserver(records=>{if(records.some(r=>r.type==='childList'))update();}).observe(grid,{childList:true});update();return update;
}
