const $ = s => document.querySelector(s);
const visited = new Set();
let currentPlace, returnFocus;
const stars = $('.stars');
let seed = 42;
const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
// A repeatable scattering of tiny sky ornaments, behind the story and controls.
for(let i=0;i<112;i++){
 const star=document.createElement('span');
 star.className='star'+(i%4===0?' cross':'');
 const x=((i%14)+.15+random()*.7)/14*100;
 const y=(Math.floor(i/14)+.15+random()*.7)/8*100;
 star.style.cssText=`left:${x}%;top:${y}%;--star-size:${i%4===0?8+random()*7:2+random()*2}px;--shimmer-time:${6+random()*7}s;animation-delay:-${random()*13}s;--star-color:${i%3===0?'#c29b79':i%3===1?'#fffbed':'#a99bbd'}`;
 stars.append(star);
}
for(let i=0;i<12;i++){
 const planet=document.createElement('span');
 planet.className='sky-planet'+(i%3!==1?' ringed':'');
 const x=((i%4)+.25+random()*.5)/4*100;
 const y=(Math.floor(i/4)+.35+random()*.3)/3*100;
 planet.style.cssText=`left:${x}%;top:${y}%;--planet-size:${15+random()*13}px;--planet-tone:${['#b7a5cd','#dfb6c3','#d5c296'][i%3]};--planet-tilt:${-30+random()*50}deg;animation-duration:${13+random()*9}s;animation-delay:-${random()*20}s`;
 stars.append(planet);
}

const svg = content => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="none">${content}</svg>`;
const encounters = {
 greenhouse:{kicker:'01 / THE GREENHOUSE',title:'A little tenderness.',text:'<p>She watered it every evening, even on the days it looked exactly the same.</p>',art:svg(`<ellipse cx="150" cy="265" rx="110" ry="12" fill="#b3a2ba" opacity=".15"/><path class="warm-glass" d="M55 254V108L150 38L245 108V254Z" fill="#637b9c" opacity=".5"/><g stroke="#d6bc9e" stroke-width="2"><path d="M55 254V108L150 38L245 108V254ZM55 108H245M150 38V254M100 75V254M200 75V254M55 185H245"/><path d="M48 258H252" stroke-width="5"/></g><path d="M150 235V166M150 212Q112 207 119 186Q151 187 150 212M150 199Q182 196 178 179Q150 181 150 199" stroke="#8f9c7c" fill="#8f9c7c" stroke-width="3"/><path d="M128 229H172L165 256H135Z" fill="#c28e88" stroke="#e0b4a0"/><g class="rose-bloom" fill="#dda4b5" stroke="#a56786"><ellipse cx="139" cy="167" rx="17" ry="12" transform="rotate(35 139 167)"/><ellipse cx="160" cy="165" rx="16" ry="13" transform="rotate(-35 160 165)"/><ellipse cx="151" cy="155" rx="13" ry="16"/><path d="M133 160Q150 173 169 157Q169 187 150 184Q131 180 133 160Z"/><path d="M145 157Q162 152 157 166Q146 173 145 157Z"/></g>` )},
 mailbox:{kicker:'02 / THE MAILBOX',title:'For whoever finds this.',text:"<p>Dear whoever finds this,</p><p>I used to think a planet had to be big to be worth discovering. Then I spent a whole afternoon watching a bee try to land on a rose.</p><p>I hope you're having that kind of day.</p><p>Love,<br>the girl on the little planet.</p>",art:svg(`<path d="M148 202V282" stroke="#ae939e" stroke-width="9"/><path d="M58 212V139Q58 110 88 110H211Q239 110 239 139V212Z" fill="#b7899c" stroke="#d0a5b2" stroke-width="2"/><path d="M58 139Q58 110 88 110Q118 110 118 139V212" stroke="#654e6e" stroke-width="2"/><g class="letter"><path d="M100 45L229 54L217 181L90 173Z" fill="#f0dfc3" stroke="#c7ae91"/><path d="M113 78L208 84M111 94L202 100M109 110L205 116M107 126L176 130" stroke="#ac9292" stroke-width="2"/><path d="M150 150q-18-17-21-4q0 10 19 17q19-8 14-17q-5-9-12 4" fill="#c58a9b"/></g><path d="M118 172L239 172V212H118Z" fill="#a7758d" stroke="#d0a5b2"/><path d="M246 147V96H270V110H246" stroke="#d5b68b" stroke-width="3"/>`)},
 telescope:{kicker:'03 / THE TELESCOPE',title:'Written in the stars.',text:'<p>She was fairly sure the stars had moved. She decided to take it as a compliment.</p>',art:svg(`<circle cx="150" cy="145" r="113" fill="#151c37" stroke="#bca8ba"/><circle cx="150" cy="145" r="105" stroke="#bca8ba" stroke-opacity=".2"/><g fill="#d7c4aa"><circle cx="83" cy="92" r="1"/><circle cx="193" cy="62" r="1"/><circle cx="221" cy="177" r="1"/><circle cx="112" cy="221" r="1"/><circle cx="68" cy="163" r="1"/><circle cx="173" cy="207" r="1"/></g><path class="constellation" d="M103 191L149 139L92 100L84 147L149 139L207 93L217 145L149 139L193 195" stroke="#e1bf95" stroke-width="1.5"/>${[[103,191],[149,139],[92,100],[84,147],[207,93],[217,145],[193,195]].map(([x,y],i)=>`<g class="constellation-star" style="--delay:${i*.5}s"><circle cx="${x}" cy="${y}" r="7" fill="#ebc99e" opacity=".12"/><path d="M${x-4} ${y}h8M${x} ${y-4}v8" stroke="#f2d5ad" stroke-width="1.5"/></g>`).join('')}`)}
};
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let sceneChanging = false;
async function transitionScene(update,selector='.experience'){
 if(sceneChanging)return;
 sceneChanging=true;
 const targets=document.querySelectorAll(selector);
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 try{
  if(!reducedMotion.matches){
   targets.forEach(target=>{target.style.transition='opacity 220ms ease-in';target.style.opacity='0';});
   await wait(220);
  }
  update();
  targets.forEach(target=>{target.style.transition='opacity 650ms ease-out';target.style.opacity='1';});
  if(!reducedMotion.matches)await wait(650);
 }finally{targets.forEach(target=>{target.style.removeProperty('opacity');target.style.removeProperty('transition');});sceneChanging=false;}
}
// Fade in the illustration only once its local image has decoded.
const planetArt=$('.planet');
if(!planetArt.complete){
 planetArt.classList.add('art-loading');
 const revealArt=()=>planetArt.classList.remove('art-loading');
 planetArt.addEventListener('load',revealArt,{once:true});
 planetArt.addEventListener('error',revealArt,{once:true});
}
$('#visit').addEventListener('click',()=>transitionScene(()=>{ $('#intro').hidden=true;$('#explore').hidden=false;$('.landmarks').hidden=false;document.body.classList.add('visiting');$('#explore-title').focus(); }));
function renderEncounter(){const item=encounters[currentPlace];$('#encounter-kicker').textContent=item.kicker;$('#encounter-title').textContent=item.title;$('#encounter-text').innerHTML=item.text;$('#encounter-art').innerHTML=item.art;}
document.querySelectorAll('[data-place]').forEach(button=>button.addEventListener('click',()=>{currentPlace=button.dataset.place;returnFocus=button;renderEncounter();$('#encounter').showModal();$('.close').focus();}));
let encounterClosing=false;
async function closeEncounter(){
 if(encounterClosing||!$('#encounter').open)return;
 encounterClosing=true;
 const dialog=$('#encounter');
 if(!reducedMotion.matches){
  dialog.classList.add('closing');
  await dialog.animate([{opacity:1},{opacity:0}],{duration:240,easing:'ease-in'}).finished;
 }
 dialog.close();
 dialog.classList.remove('closing');
 encounterClosing=false;
 finishEncounter();
}
$('#encounter').addEventListener('cancel', event=>{event.preventDefault();closeEncounter();});
$('.close').addEventListener('click',closeEncounter);$('#back').addEventListener('click',closeEncounter);$('#replay').addEventListener('click',renderEncounter);
function finishEncounter(){visited.add(currentPlace);document.querySelectorAll('.places button').forEach(b=>{const done=visited.has(b.dataset.place);b.classList.toggle('done',done);b.setAttribute('aria-label',`${encounters[b.dataset.place].kicker.split(' / ')[1].toLowerCase()}${done?', discovered — replay':''}`);});$('.progress').textContent=`${visited.size} of 3 little wonders discovered`;if(visited.size===3){transitionScene(()=>{$('#explore').hidden=true;$('#ending').hidden=false;document.body.classList.add('dawn');$('#ending-title').focus();},'.copy');}else{returnFocus.focus();}}
$('#reset').addEventListener('click',()=>transitionScene(()=>{visited.clear();document.body.classList.remove('dawn');$('#ending').hidden=true;$('#explore').hidden=false;document.querySelectorAll('.places button').forEach(b=>{b.classList.remove('done');b.removeAttribute('aria-label');});$('.progress').textContent='0 of 3 little wonders discovered';$('#explore-title').focus();},'.copy'));
const music=$('#music');let soundOn=false,fadeFrame=0,soundVersion=0;
function fade(target,after){cancelAnimationFrame(fadeFrame);const start=music.volume,t0=performance.now();function tick(t){const p=Math.min(1,(t-t0)/800);music.volume=start+(target-start)*p;if(p<1)fadeFrame=requestAnimationFrame(tick);else if(after)after();}fadeFrame=requestAnimationFrame(tick);}
function soundUI(){ $('#sound').setAttribute('aria-pressed',String(soundOn));$('#sound-label').textContent=soundOn?'Sound on':'Sound off'; }
async function resumeMusic(){cancelAnimationFrame(fadeFrame);const version=++soundVersion;music.volume=0;try{await music.play();if(version!==soundVersion||!soundOn||document.hidden)return;fade(.5);}catch{if(version===soundVersion){soundOn=false;soundUI();$('#sound-label').textContent='Sound unavailable';}}}
$('#sound').addEventListener('click',()=>{soundOn=!soundOn;soundUI();if(soundOn)resumeMusic();else{soundVersion++;fade(0,()=>music.pause());}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){soundVersion++;cancelAnimationFrame(fadeFrame);music.pause();music.volume=0;}else if(soundOn)resumeMusic();});
// Keep Tab cycling through encounter controls, including at browser chrome boundaries.
$('#encounter').addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 const controls=[...$('#encounter').querySelectorAll('button:not([disabled])')];
 const first=controls[0],last=controls[controls.length-1];
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
