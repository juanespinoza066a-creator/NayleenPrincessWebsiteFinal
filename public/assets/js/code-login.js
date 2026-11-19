// Only active in the Vercel code-login edition. No passcode is bundled here.
let opening; const beforeLogout=new Set();
export const CODE_LOGIN = window.CARNIVAL_CONFIG?.mode === 'code';
export function onCodeLogout(fn) {beforeLogout.add(fn);}
export function ensureCodeLogin() {
 if(!CODE_LOGIN)return Promise.resolve();
 return opening ??= openLogin();
}
async function request(method='GET',data) {const r=await fetch('api/code-session',{method,cache:'no-store',headers:{'Content-Type':'application/json'},body:data?JSON.stringify(data):undefined});let payload;try{payload=await r.json()}catch{throw new Error('The code-login service is not configured yet. Please ask Juan to check the deployment guide.')}if(!r.ok)throw new Error(payload.error||'Please try again.');return payload;}
async function openLogin() {
 const panel=document.createElement('div');panel.className='code-account';const label=document.createElement('span'),logout=document.createElement('button');logout.type='button';logout.className='text-button';logout.textContent='Sign out';logout.hidden=true;panel.append(label,logout);document.body.append(panel);
 logout.onclick=async()=>{logout.disabled=true;try{await Promise.all([...beforeLogout].map(fn=>fn()));await request('DELETE');location.reload()}catch(e){label.textContent=e.message;logout.disabled=false}};
 const mark=profile=>{label.textContent=profile==='testing'?'Testing profile · separate save':'Nayleen’s cloud save ♡';logout.hidden=false;};
 try{const current=await request();if(current.signedIn){mark(current.profile);return {profile:current.profile}}}catch{}
 return await new Promise(resolve=>{
  const dialog=document.createElement('dialog');dialog.className='code-login';dialog.setAttribute('aria-labelledby','code-login-title');
  const title=document.createElement('h2');title.id='code-login-title';title.textContent='Your little carnival ♡';
  const intro=document.createElement('p');intro.textContent='Enter the code 956 to login. Progress will be saved on this website.';
  const form=document.createElement('form'),fieldLabel=document.createElement('label'),input=document.createElement('input'),submit=document.createElement('button'),status=document.createElement('p');
  input.id='carnival-code';input.type='password';input.inputMode='numeric';input.autocomplete='off';input.required=true;input.maxLength=100;fieldLabel.htmlFor=input.id;fieldLabel.textContent='Our carnival code';submit.type='submit';submit.className='button';submit.textContent='Come inside ♡';status.setAttribute('role','status');form.append(fieldLabel,input,submit,status);dialog.append(title,intro,form);document.body.append(dialog);dialog.addEventListener('cancel',e=>e.preventDefault());dialog.showModal();input.focus();
  form.onsubmit=async e=>{e.preventDefault();submit.disabled=true;status.textContent='Opening your carnival…';try{const current=await request('POST',{code:input.value});input.value='';dialog.close();dialog.remove();mark(current.profile);resolve({profile:current.profile})}catch(error){status.textContent=error.message;submit.disabled=false}};
 });
}
if(CODE_LOGIN) void ensureCodeLogin();
