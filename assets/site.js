'use strict';
const siteBase = new URL('../', document.currentScript.src);
const sitePath = path => new URL(path, siteBase).href;
const page = document.body.dataset.page || 'home';
const links = [['home','index.html','홈'],['about','about.html','내 소개'],['products','products.html','제품'],['story','story/','이야기'],['contact','contact.html','연락하기']];
const brand = `<a class="brand brand-wordmark" href="${sitePath('index.html')}" aria-label="스노우밸리 코리아 홈"><img src="${sitePath('assets/snowvalley-korea-wordmark.webp')}" alt="SNOWVALLEY KOREA" width="1200" height="400"></a>`;
document.querySelector('[data-header]').innerHTML = `<div class="wrap header-inner">${brand}<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav">메뉴</button><nav class="nav" id="main-nav" aria-label="주 메뉴">${links.map(([id,url,label])=>`<a href="${sitePath(url)}"${id===page?' aria-current="page"':''}>${label}</a>`).join('')}</nav></div>`;
document.querySelector('[data-footer]').innerHTML = `<div class="wrap"><div class="footer-top"><div>${brand}<p class="footer-description">스노우밸리 코리아 · 브랜드와 제품을 소개할 공간</p></div><div class="footer-links">${links.slice(1).map(([,url,label])=>`<a href="${sitePath(url)}">${label}</a>`).join('')}<a href="https://snowvalleyfood.com/" target="_blank" rel="noopener noreferrer">본사 홈페이지 ↗</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} SNOW VALLEY KOREA</span><div class="footer-contacts" data-footer-contacts></div></div></div>`;
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function closeMenu(){toggle.setAttribute('aria-expanded','false');toggle.textContent='메뉴';nav.classList.remove('is-open');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'닫기':'메뉴';nav.classList.toggle('is-open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
matchMedia('(min-width:681px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
function el(tag,className,text){const element=document.createElement(tag);if(className)element.className=className;if(text!==undefined)element.textContent=text;return element;}
function safeUrl(value,externalOnly=false){if(!value)return null;try{const u=new URL(value,location.href);if(!['https:','http:'].includes(u.protocol))return null;if(externalOnly&&u.origin===location.origin)return null;return u.href;}catch{return null;}}
async function data(url){const response=await fetch(sitePath(url));if(!response.ok)throw new Error('데이터를 불러오지 못했습니다.');return response.json();}
function error(container,text){container.replaceChildren(el('p','error-note',text));}
function framedPhoto(product,url){
 const f=product.photoFrame,ns='http://www.w3.org/2000/svg';
 const svg=document.createElementNS(ns,'svg');const [left,top,right,bottom]=f.bounds;
 const side=Math.max(right-left,bottom-top)/.82;
 svg.setAttribute('viewBox',`${(left+right-side)/2} ${(top+bottom-side)/2} ${side} ${side}`);
 svg.setAttribute('role','img');svg.setAttribute('aria-label',product.name);svg.classList.add('catalog-photo');
 const image=document.createElementNS(ns,'image');image.setAttribute('href',url);image.setAttribute('width',f.width);image.setAttribute('height',f.height);
 if(f.outline){const defs=document.createElementNS(ns,'defs'),mask=document.createElementNS(ns,'mask'),poly=document.createElementNS(ns,'polygon'),filter=document.createElementNS(ns,'filter'),blur=document.createElementNS(ns,'feGaussianBlur');mask.id=`photo-${product.id}`;mask.setAttribute('maskUnits','userSpaceOnUse');mask.setAttribute('x','0');mask.setAttribute('y','0');mask.setAttribute('width',f.width);mask.setAttribute('height',f.height);filter.id=`soft-${product.id}`;blur.setAttribute('stdDeviation','2');const erode=document.createElementNS(ns,'feMorphology');erode.setAttribute('operator','erode');erode.setAttribute('radius','5');filter.append(erode,blur);poly.setAttribute('points',f.outline);poly.setAttribute('fill','white');poly.setAttribute('filter',`url(#${filter.id})`);mask.append(poly);defs.append(filter,mask);svg.append(defs);image.setAttribute('mask',`url(#${mask.id})`);}
 svg.append(image);return svg;
}
function renderProduct(product,index){const card=el('article','product-card');const visual=el('div','product-visual');const fallback=()=>{visual.replaceChildren(el('span','placeholder-number',String(index+1).padStart(2,'0')),el('span','placeholder-label','제품 이미지 준비 중'));};const imageUrl=safeUrl(page==='home'&&product.homeImage?product.homeImage:product.image);if(imageUrl){const img=el('img');img.src=imageUrl;img.alt=product.name;img.loading='lazy';img.addEventListener('error',fallback,{once:true});if(product.photoFrame)visual.append(framedPhoto(product,imageUrl));else visual.append(img);}else fallback();card.append(visual);if(product.status==='preparing')card.append(el('span','tag','준비 중'));card.append(el('h3','',product.name));if(product.summary){const info=el('div','product-info');info.append(el('p','product-summary',product.summary),el('p','product-pack',product.pack),el('p','product-case',product.casePack));card.append(info);}else card.append(el('p','',product.description));if(product.price!==null&&product.price!==undefined&&product.price!=='')card.append(el('p','product-price',typeof product.price==='number'?`${product.price.toLocaleString('ko-KR')}원`:product.price));const url=safeUrl(product.purchaseUrl,true);if(url){const a=el('a','text-link','구매하기 ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',`${product.name} 구매하기 (새 탭)`);card.append(a);}else card.append(el('span','inactive','구매 정보 준비 중'));return card;}
const productArea=document.querySelector('[data-products]');
if(productArea)data('products.json').then(items=>{const shown=page==='home'?items.filter(p=>p.featured).slice(0,3):items;productArea.replaceChildren(...shown.map(renderProduct));if(!shown.length)error(productArea,'새로운 제품을 준비하고 있습니다.');}).catch(()=>error(productArea,'제품 정보를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.'));
const storyArea=document.querySelector('[data-stories]');
if(storyArea)data('story/posts.json').then(items=>{const sorted=[...items].sort((a,b)=>(b.date||'').localeCompare(a.date||''));const shown=page==='home'?sorted.slice(0,3):sorted;storyArea.replaceChildren(...shown.map(post=>{const card=el('article','story-card');if(['first-story-20260829','behind-package-20260829'].includes(post.id))card.append(el('span','tag','키트 샘플 · 실제 브랜드 사례 아님'));card.append(el('div','category',post.category||'STORY'));if(post.status==='preparing')card.append(el('span','tag','준비 중'));if(post.date){const time=el('time','category',post.date);time.dateTime=post.date;card.append(time);}card.append(el('h3','',post.title),el('p','',post.summary));const a=el('a','text-link','이야기 보기 ↗');a.href=sitePath(`story/post.html?id=${encodeURIComponent(post.id)}`);card.append(a);return card;}));if(!shown.length)error(storyArea,'첫 번째 이야기를 준비하고 있습니다.');}).catch(()=>error(storyArea,'이야기를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.'));
const articleArea=document.querySelector('[data-article]');
if(articleArea)data('posts.json').then(items=>{const post=items.find(p=>p.id===new URLSearchParams(location.search).get('id'));if(!post){error(articleArea,'요청하신 이야기를 찾을 수 없습니다.');return;}document.title=`${post.title} | 스노우밸리 코리아`;document.querySelector('meta[name="description"]').content=post.summary;articleArea.replaceChildren(el('p','eyebrow',post.category||'STORY'));if(post.status==='preparing')articleArea.append(el('span','tag','준비 중'));articleArea.append(el('h1','',post.title));if(post.date){const t=el('time','',post.date);t.dateTime=post.date;articleArea.append(t);}post.body.forEach(text=>articleArea.append(el('p','',text)));}).catch(()=>error(articleArea,'이야기를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.'));
const contactArea=document.querySelector('[data-contacts]');
function contactUrl(contact){
 if(contact.type==='email'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.value||''))return `mailto:${contact.value}`;
 if(contact.type==='phone'&&/^[+0-9 ()-]+$/.test(contact.value||''))return `tel:${contact.value.replace(/[ ()-]/g,'')}`;
 return safeUrl(contact.value,true);
}
data('contact.json').then(items=>{
 const contacts=items.filter(c=>c.value&&contactUrl(c));
 const footer=document.querySelector('[data-footer-contacts]');
 contacts.forEach(contact=>{const a=el('a','',contact.value);a.href=contactUrl(contact);a.target='_blank';a.rel='noopener noreferrer';footer.append(a);});
 if(contactArea)contactArea.replaceChildren(...contacts.map((contact,index)=>{
  const row=el('div','contact-row');row.append(el('span','eyebrow',String(index+1).padStart(2,'0')));
  const label=el('div','contact-name');label.append(el('small','',contact.english),el('h2','',contact.label));row.append(label);
  const a=el('a','button contact-button',`${contact.type==='phone'?'전화 걸기':'이메일 보내기'} · ${contact.value}`);a.href=contactUrl(contact);a.target='_blank';a.rel='noopener noreferrer';row.append(a);return row;
 }));
}).catch(()=>{if(contactArea)error(contactArea,'연락처를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.');});

// Harvest video plays only when visible, with user and accessibility controls.
const heroVideo=document.querySelector('.harvest-video');
const motionToggle=document.querySelector('.motion-toggle');
if(heroVideo&&motionToggle){
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 let userPaused=false,visible=false,loaded=false,failed=false;
 heroVideo.muted=true;
 function syncVideo(){
  const reduced=reducedMotion.matches;
  motionToggle.hidden=reduced||failed;
  if(reduced||userPaused||!visible||document.hidden){heroVideo.pause();return;}
  if(!loaded){const source=heroVideo.querySelector('source');source.src=source.dataset.src;heroVideo.load();loaded=true;}
  if(!failed)heroVideo.play().catch(()=>{motionToggle.textContent='영상 재생';});
 }
 heroVideo.addEventListener('play',()=>motionToggle.textContent='영상 정지');
 heroVideo.addEventListener('pause',()=>motionToggle.textContent='영상 재생');
 function videoFailed(){failed=true;heroVideo.pause();heroVideo.removeAttribute('src');heroVideo.load();motionToggle.hidden=true;}
 heroVideo.querySelector('source').addEventListener('error',videoFailed,{once:true});
 motionToggle.addEventListener('click',()=>{userPaused=!heroVideo.paused;syncVideo();});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncVideo();},{threshold:0.15}).observe(heroVideo);
 reducedMotion.addEventListener('change',syncVideo);
 document.addEventListener('visibilitychange',syncVideo);
 syncVideo();
}
