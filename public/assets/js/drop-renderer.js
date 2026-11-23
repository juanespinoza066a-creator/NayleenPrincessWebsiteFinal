// Cache expensive shading and artwork outside the physics loop.
export function dropRenderer(context, images, radii, ratio) {
 const create=(w,h)=>{const canvas=document.createElement('canvas');canvas.width=Math.ceil(w*ratio);canvas.height=Math.ceil(h*ratio);const c=canvas.getContext('2d');c.setTransform(ratio,0,0,ratio,0,0);return {canvas,c};};
 let backdrop;const sprites=[];
 const colors=['#f4c4d8','#e8d0b5','#c3dbba','#eebbd2','#d7c4eb','#d7dced','#bcd7ec','#c1ddf5','#ded5df'];
 function sprite(tier){
  const r=radii[tier],size=r*2+20,{canvas,c}=create(size,size);c.translate(size/2,size/2);c.shadowColor='#84588b33';c.shadowBlur=6;c.shadowOffsetY=3;c.fillStyle=colors[tier];c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.fill();c.strokeStyle='#a07bab';c.stroke();c.shadowBlur=0;c.shadowOffsetY=0;c.fillStyle='#ffffff77';c.beginPath();c.ellipse(-r*.3,-r*.45,r*.3,r*.12,-.5,0,Math.PI*2);c.fill();const im=images[tier];if(im.complete&&im.naturalWidth){const k=Math.min(r*1.65/im.naturalWidth,r*1.65/im.naturalHeight);c.drawImage(im,-im.naturalWidth*k/2,-im.naturalHeight*k/2,im.naturalWidth*k,im.naturalHeight*k);}return {canvas,size};
 }
 for(let tier=0;tier<images.length;tier++)images[tier].onload=()=>{delete sprites[tier];};
 return {
  background(overflow){
   if(!backdrop){const {canvas,c}=create(400,650),g=c.createLinearGradient(0,0,400,650);g.addColorStop(0,'#fff6e9');g.addColorStop(.45,'#fae8f4');g.addColorStop(1,'#ddd4f4');c.fillStyle=g;c.fillRect(0,0,400,650);for(let k=0;k<12;k++){c.fillStyle=k%2?'#d9bedc55':'#efd7b955';c.font='17px serif';c.fillText(k%2?'♡':'✧',12+(k*83)%375,145+(k*71)%460);}c.fillStyle='#fff7ff99';c.fillRect(40,145,320,455);c.font='14px sans-serif';c.fillStyle='#573466';c.fillText('Keep treasures below the ribbon ♡',50,166);c.strokeStyle='#c7a67f';c.lineWidth=5;c.strokeRect(38,130,324,472);backdrop=canvas;}
   context.setTransform(ratio,0,0,ratio,0,0);context.clearRect(0,0,400,650);context.drawImage(backdrop,0,0,400,650);context.strokeStyle=overflow>0?'#be507a':'#9870af';context.setLineDash([8,7]);context.beginPath();context.moveTo(40,145);context.lineTo(360,145);context.stroke();context.setLineDash([]);
  },
  paint(tier,x,y,angle=0){const s=sprites[tier]??=sprite(tier);context.save();context.translate(x,y);context.rotate(angle);context.drawImage(s.canvas,-s.size/2,-s.size/2,s.size,s.size);context.restore();}
 };
}
