'use strict';
/* गीता reader engine — vanilla core mounted by the React client component.
   Data: /data/index.json (chapter meta) + /data/chapter-NN.json (canonical schema, lazy). */

const PAL = {
1:{bg:'#2b2b2e',ink:'#e8e4dc',mut:'rgba(232,228,220,.52)',acc:'#9a938a',fop:.5,
 fx:[{w:'130vmax',h:'46vmax',x:'-20%',y:'52%',r:'50%',g:'radial-gradient(ellipse at 50% 50%, rgba(120,118,124,.5), transparent 70%)'},
     {w:'110vmax',h:'38vmax',x:'12%',y:'18%',r:'50%',g:'radial-gradient(ellipse at 50% 50%, rgba(90,88,96,.42), transparent 70%)'}]},
2:{bg:'#f4efe4',ink:'#2a2723',mut:'rgba(42,39,35,.5)',acc:'#b06a2c',fop:.6,
 fx:[{w:'80vmax',h:'80vmax',x:'14%',y:'46%',r:'50%',g:'radial-gradient(circle, rgba(222,150,70,.5), rgba(222,150,70,.12) 45%, transparent 68%)'}]},
3:{bg:'#efe2d0',ink:'#33291f',mut:'rgba(51,41,31,.5)',acc:'#a4502e',fop:.55,
 fx:[{w:'95vmax',h:'95vmax',x:'34%',y:'-8%',r:'50%',g:'radial-gradient(circle, transparent 34%, rgba(164,80,46,.4) 46%, rgba(164,80,46,.1) 58%, transparent 70%)'}]},
4:{bg:'#2e2418',ink:'#f0e6d2',mut:'rgba(240,230,210,.5)',acc:'#d99a2b',fop:.6,
 fx:[{w:'70vmax',h:'70vmax',x:'-12%',y:'30%',r:'50%',g:'radial-gradient(circle, rgba(217,154,43,.65) 0%, rgba(217,154,43,.18) 32%, transparent 62%)'}]},
5:{bg:'#e9ead8',ink:'#2c3026',mut:'rgba(44,48,38,.5)',acc:'#6f7d5c',fop:.55,
 fx:[{w:'56vmax',h:'56vmax',x:'-4%',y:'26%',r:'50%',g:'radial-gradient(circle, rgba(111,125,92,.42), transparent 66%)'},
     {w:'56vmax',h:'56vmax',x:'48%',y:'26%',r:'50%',g:'radial-gradient(circle, rgba(111,125,92,.42), transparent 66%)'}]},
6:{bg:'#23252e',ink:'#dfe0e8',mut:'rgba(223,224,232,.5)',acc:'#8b93b8',fop:.55,
 fx:[{w:'58vmax',h:'58vmax',x:'21%',y:'8%',r:'50%',g:'radial-gradient(circle, rgba(139,147,184,.5), rgba(139,147,184,.12) 42%, transparent 66%)'}]},
7:{bg:'#dfe9e6',ink:'#1f3331',mut:'rgba(31,51,49,.5)',acc:'#3f7d74',fop:.55,
 fx:[{w:'140vmax',h:'30vmax',x:'-20%',y:'22%',r:'50%',g:'radial-gradient(ellipse, rgba(63,125,116,.4), transparent 70%)'},
     {w:'140vmax',h:'30vmax',x:'-10%',y:'52%',r:'50%',g:'radial-gradient(ellipse, rgba(63,125,116,.3), transparent 70%)'},
     {w:'140vmax',h:'30vmax',x:'-26%',y:'76%',r:'50%',g:'radial-gradient(ellipse, rgba(63,125,116,.22), transparent 70%)'}]},
8:{bg:'#2a2433',ink:'#e6dfee',mut:'rgba(230,223,238,.5)',acc:'#a98fc9',fop:.55,
 fx:[{w:'130vmax',h:'34vmax',x:'-6%',y:'-4%',r:'50%',rot:'-24deg',g:'radial-gradient(ellipse, rgba(169,143,201,.5), transparent 68%)'}]},
9:{bg:'#1f2a44',ink:'#e9e6da',mut:'rgba(233,230,218,.5)',acc:'#d4af5a',fop:.55,
 fx:[{w:'150vmax',h:'70vmax',x:'-26%',y:'40%',r:'50%',g:'radial-gradient(ellipse, rgba(70,90,140,.5), transparent 70%)'},
     {w:'34vmax',h:'34vmax',x:'58%',y:'6%',r:'50%',g:'radial-gradient(circle, rgba(212,175,90,.5), transparent 62%)'}]},
10:{bg:'#21303a',ink:'#e3ecee',mut:'rgba(227,236,238,.5)',acc:'#56b3a9',fop:.55,
 fx:[{w:'26vmax',h:'26vmax',x:'8%',y:'12%',r:'50%',g:'radial-gradient(circle, rgba(86,179,169,.5), transparent 64%)'},
     {w:'18vmax',h:'18vmax',x:'62%',y:'26%',r:'50%',g:'radial-gradient(circle, rgba(201,164,74,.45), transparent 64%)'},
     {w:'22vmax',h:'22vmax',x:'30%',y:'58%',r:'50%',g:'radial-gradient(circle, rgba(86,179,169,.4), transparent 64%)'},
     {w:'14vmax',h:'14vmax',x:'74%',y:'68%',r:'50%',g:'radial-gradient(circle, rgba(201,164,74,.4), transparent 64%)'}]},
11:{bg:'#14110e',ink:'#f0e7d4',mut:'rgba(240,231,212,.5)',acc:'#e0a830',fop:.7,
 fx:[{w:'120vmax',h:'120vmax',x:'50%',y:'50%',cc:1,r:'50%',g:'radial-gradient(circle, transparent 30%, rgba(224,168,48,.55) 39%, rgba(224,168,48,.1) 47%, transparent 58%)'},
     {w:'40vmax',h:'40vmax',x:'50%',y:'50%',cc:1,r:'50%',g:'radial-gradient(circle, rgba(224,168,48,.25), transparent 60%)'}]},
12:{bg:'#f3e7e2',ink:'#3a2a28',mut:'rgba(58,42,40,.5)',acc:'#b65e4e',fop:.55,
 fx:[{w:'72vmax',h:'72vmax',x:'50%',y:'46%',cc:1,r:'50%',g:'radial-gradient(circle, rgba(182,94,78,.42), rgba(182,94,78,.1) 42%, transparent 66%)'}]},
13:{bg:'#efeadd',ink:'#322e26',mut:'rgba(50,46,38,.5)',acc:'#7d7257',fop:.55,
 fx:[{w:'110vmax',h:'60vmax',x:'-12%',y:'34%',r:'14%',g:'radial-gradient(ellipse, rgba(125,114,87,.34), transparent 72%)'},
     {w:'10vmax',h:'10vmax',x:'66%',y:'24%',r:'50%',g:'radial-gradient(circle, rgba(217,176,90,.7), transparent 60%)'}]},
14:{bg:'#e8e4da',ink:'#2e2b26',mut:'rgba(46,43,38,.5)',acc:'#8a8175',fop:.55,
 fx:[{w:'150vmax',h:'24vmax',x:'-20%',y:'10%',r:'50%',g:'radial-gradient(ellipse, rgba(222,205,150,.55), transparent 72%)'},
     {w:'150vmax',h:'24vmax',x:'-20%',y:'42%',r:'50%',g:'radial-gradient(ellipse, rgba(201,139,90,.45), transparent 72%)'},
     {w:'150vmax',h:'24vmax',x:'-20%',y:'74%',r:'50%',g:'radial-gradient(ellipse, rgba(74,68,62,.5), transparent 72%)'}]},
15:{bg:'#1e2a23',ink:'#e5e8dd',mut:'rgba(229,232,221,.5)',acc:'#c9a44a',fop:.55,
 fx:[{w:'60vmax',h:'90vmax',x:'24%',y:'-30%',r:'50%',g:'radial-gradient(ellipse at 50% 18%, rgba(201,164,74,.55), rgba(201,164,74,.12) 46%, transparent 70%)'}]},
16:{bg:'#ece7db',ink:'#2c2924',mut:'rgba(44,41,36,.5)',acc:'#6b6353',fop:.55,
 fx:[{w:'70vmax',h:'140vmax',x:'-16%',y:'-20%',r:'50%',g:'radial-gradient(ellipse, rgba(245,238,218,.85), transparent 70%)'},
     {w:'70vmax',h:'140vmax',x:'56%',y:'-20%',r:'50%',g:'radial-gradient(ellipse, rgba(72,66,58,.4), transparent 70%)'}]},
17:{bg:'#ece3d3',ink:'#322c24',mut:'rgba(50,44,36,.5)',acc:'#a4502e',fop:.55,
 fx:[{w:'24vmax',h:'24vmax',x:'50%',y:'14%',cc:1,r:'50%',g:'radial-gradient(circle, rgba(222,205,150,.6), transparent 62%)'},
     {w:'24vmax',h:'24vmax',x:'50%',y:'44%',cc:1,r:'50%',g:'radial-gradient(circle, rgba(164,80,46,.45), transparent 62%)'},
     {w:'24vmax',h:'24vmax',x:'50%',y:'74%',cc:1,r:'50%',g:'radial-gradient(circle, rgba(74,68,62,.45), transparent 62%)'}]},
18:{bg:'#faf6ec',ink:'#2b2722',mut:'rgba(43,39,34,.5)',acc:'#b08a32',fop:.6,
 fx:[{w:'160vmax',h:'8vmax',x:'-30%',y:'66%',r:'50%',g:'radial-gradient(ellipse, rgba(201,164,74,.65), rgba(201,164,74,.12) 55%, transparent 75%)'}]},
};

// lens -> [Sanskrit label, tradition, commentator]
const LENS={advaita:['अद्वैत','Advaita (non-dualism) · Śaṅkara','Śaṅkara (Gītā-bhāṣya, tr. Gambhirananda)'],
  vishishtadvaita:['विशिष्टाद्वैत','Viśiṣṭādvaita (qualified non-dualism) · Rāmānuja','Rāmānuja (Gītā-bhāṣya, tr. Adidevananda)'],
  shaiva:['शैव','Kashmir Śaiva · Abhinavagupta','Abhinavagupta (Gītārtha-saṅgraha, tr. Sankaranarayan)'],
  bhakti:['भक्ति','Bhakti · Śrīdhara Svāmī','Śrīdhara Svāmī (Subodhinī)'],
  practice:['साधना','Practice · Swami Sivananda','Swami Sivananda'],
  bhaktiyoga:['भक्तियोग','Bhakti-yoga · Swami Mukundananda','Swami Mukundananda (holy-bhagavad-gita.org)']};
// which editions the verse text was compared with and matched (set by the audit, docs/AUDIT.md)
const CHK={S:'the Gita Supersite text (IIT Kanpur, via the gita/gita dataset)',G:'the BORI critical edition (GRETIL)',V:'the vedicscriptures dataset'};
const EYE='<svg viewBox="0 0 48 28" aria-hidden="true"><defs><clipPath id="eyc"><path d="M3 14C12 3 30 2 45 12C31 23 13 22 3 14Z"/></clipPath></defs>'+
  '<circle class="bindu" cx="24" cy="-5.5" r="1.25"/><circle class="ring" cx="24" cy="12.5" r="7"/>'+
  '<g class="lids"><path class="crease" d="M9 7.6C17 1.6 30 .9 41 5.6"/>'+
  '<g clip-path="url(#eyc)"><circle class="iris" cx="24" cy="12" r="7"/><circle class="pupil" cx="24" cy="12" r="2.7"/></g>'+
  '<path d="M3 14C12 3 30 2 45 12"/><path d="M3 14C13 22 31 23 45 12"/></g></svg>';
const BELL='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 17h12l-1.4-2.2V11a4.6 4.6 0 0 0-9.2 0v3.8L6 17Z"/><path d="M10.3 19.6a1.8 1.8 0 0 0 3.4 0"/></svg>';
const DN='०१२३४५६७८९';
const dn=n=>String(n).split('').map(d=>DN[+d]??d).join('');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

const em=t=>esc(t).replace(/\*([^*\n]+)\*/g,'<em>$1</em>'); // the prose marks emphasis as *word*
const dev=s=>esc(s).replace(/ ।/g,'\u00a0।'); // keep the danda on the line it closes

export async function mountGita(root){
  root.innerHTML=`
  <div id="bg"><div class="flayer" id="fA"><div class="fxwrap"></div></div><div class="flayer" id="fB"><div class="fxwrap"></div></div></div>
  <div id="grain"></div><div id="pbar"></div>
  <main id="feed" aria-label="Bhagavad Gita"></main>
  <button id="plabel" aria-label="open chapter index"></button>
  <div id="xp" aria-modal="true"><div class="handle"></div><div class="inner" id="xpinner"></div></div>
  <div id="ix"><div class="inner"><h3>अष्टादश अध्यायाः · eighteen chapters</h3><div id="ixrows"></div></div></div>
  <div id="st"><div class="inner" id="stin"></div></div>
  <div id="toast" role="status"></div>
  <div id="inst" hidden><span id="insttext"></span><span class="instact"><button id="instgo">install</button><button id="instno">not now</button></span></div>
  <div id="veil"></div><div id="eye" class="eye">${EYE}</div>
  <div id="title"><div class="tin">
    <div class="tom">॥ ॐ ॥</div>
    <h1>॥ श्रीमद्भगवद्गीता ॥</h1>
    <div class="tsub">śrīmad bhagavad gītā · the song divine</div>
    <div class="tback" id="tback"></div>
    <div class="tenter"><span class="tchev">⌄</span><span>tap to enter</span></div>
  </div></div>`;
  const $=s=>root.querySelector(s);

  // Reminder rules and texts live in /remind.js, which the service worker loads too. Without it the reader still reads.
  if(!window.GitaRemind)await new Promise(done=>{const el=document.createElement('script');el.src='/remind.js';el.onload=el.onerror=done;document.head.appendChild(el)});
  const R=window.GitaRemind||null;

  const META=await fetch('/data/index.json').then(r=>r.json());
  const chData=new Map(); // chapter -> verses[]
  const pending=new Map();
  function ensureChapter(c){
    if(chData.has(c))return Promise.resolve(chData.get(c));
    if(pending.has(c))return pending.get(c);
    const p=fetch(`/data/chapter-${String(c).padStart(2,'0')}.json`)
      .then(r=>{if(!r.ok)throw new Error(`chapter ${c}: ${r.status}`);return r.json()})
      .then(j=>{chData.set(c,j.verses);return j.verses})
      .finally(()=>pending.delete(c)); // a failed download is retried on the next request
    pending.set(c,p);return p;
  }

  const SEC=[];
  META.forEach(m=>{
    for(let i=0;i<m.verses_count;i++)SEC.push({t:'v',c:m.chapter,i,m});
    SEC.push({t:'ce',c:m.chapter,m});
  });
  SEC.push({t:'fin'});
  const N=SEC.length;
  const chStart={};META.forEach(m=>{chStart[m.chapter]=SEC.findIndex(s=>s.t==='v'&&s.c===m.chapter)});

  const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},
               set(k,v){try{localStorage.setItem(k,v)}catch(e){}},
               // the service worker cannot read localStorage, so what it needs for reminders is kept in the Cache API
               getShared(){try{return caches.open('gita-state').then(c=>c.match('/state.json')).then(r=>r?r.json():null).catch(()=>null)}catch(e){return Promise.resolve(null)}},
               setShared(o){try{return caches.open('gita-state').then(c=>c.put('/state.json',new Response(JSON.stringify(o),{headers:{'Content-Type':'application/json'}}))).catch(()=>{})}catch(e){return Promise.resolve()}}};
  // drop the old unversioned chapter copies (about 2 MB); the service worker caches chapters now
  try{Object.keys(localStorage).forEach(k=>k.startsWith('gita-ch-')&&localStorage.removeItem(k))}catch(e){}
  let firstRun=!store.get('gita-pos');
  let readSet=new Set(JSON.parse(store.get('gita-read')||'[]'));
  let markSet=new Set(JSON.parse(store.get('gita-marks')||'[]'));
  const saveMarks=()=>store.set('gita-marks',JSON.stringify([...markSet]));
  let tapped=!!store.get('gita-tapped');
  let swipeHints=store.get('gita-swh')==null?6:+store.get('gita-swh');

  // ---- reading plan and record (rules and texts: public/remind.js) ----
  const parse=(k,d)=>{try{const v=JSON.parse(store.get(k));return v==null?d:v}catch(e){return d}};
  // What the reader entered must outlive every update. Read it leniently: keep fields this version does not know,
  // repair any value that is out of range, and never replace the whole thing with defaults.
  const PLAN0={on:false,time:'07:00',perDay:5,from:1,to:18};
  function cleanPlan(raw){
    const pl=Object.assign({},PLAN0,raw&&typeof raw==='object'?raw:{}),int=(v,lo,hi,d)=>Number.isFinite(+v)?Math.min(hi,Math.max(lo,Math.round(+v))):d;
    pl.on=pl.on===true;pl.time=/^([01]\d|2[0-3]):[0-5]\d$/.test(pl.time)?pl.time:PLAN0.time;
    pl.perDay=int(pl.perDay,1,700,PLAN0.perDay);pl.from=int(pl.from,1,18,1);pl.to=int(pl.to,pl.from,18,18);
    return pl;
  }
  let plan=cleanPlan(parse('gita-plan',null));
  const todayKey=()=>R?R.dayKey(new Date()):new Date().toDateString();
  let dayRec=parse('gita-day',null);if(!dayRec||dayRec.d!==todayKey())dayRec={d:todayKey(),seen:[]};
  let lastRead=+store.get('gita-last')||0,lastI=parse('gita-lasti',-1);
  let hist=parse('gita-days',{});   // {'2026-11-15': 5}: shlokas read on each day, for the streak and the real pace
  let chlog=parse('gita-chlog',{}); // {2: {s: first day read, e: day finished}}: how long each chapter took
  const iOS=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  let shared=null,readT=0,shareT=0; // shared: what the worker last saw (sent reminders, last opening)
  // A shloka counts as read once it has stayed on screen for a moment, with the title screen out of the way.
  function noteRead(i){
    clearTimeout(readT);const sec=SEC[i];if(!sec||sec.t!=='v')return;
    readT=setTimeout(function seen(){
      if(idx!==i)return;
      if(titleUp()){readT=setTimeout(seen,1500);return}
      if(dayRec.d!==todayKey())dayRec={d:todayKey(),seen:[]};
      if(!dayRec.seen.includes(i))dayRec.seen.push(i);
      lastRead=Date.now();lastI=i;
      hist[dayRec.d]=dayRec.seen.length;
      const keep=Object.keys(hist).sort().slice(-120);if(keep.length<Object.keys(hist).length)hist=Object.fromEntries(keep.map(k=>[k,hist[k]]));
      const cl=chlog[sec.c]||(chlog[sec.c]={s:dayRec.d});
      if(sec.i+1>=sec.m.verses_count&&!cl.e){cl.e=dayRec.d;store.set('gita-chlast',String(sec.c))}
      store.set('gita-days',JSON.stringify(hist));store.set('gita-chlog',JSON.stringify(chlog));
      store.set('gita-day',JSON.stringify(dayRec));store.set('gita-last',String(lastRead));store.set('gita-lasti',String(i));
      shareState();
    },1500);
  }
  const inPlan=sec=>sec.t==='v'&&sec.c>=plan.from&&sec.c<=plan.to;
  function chapterRecord(c){ // days it took, the pace, and how long the rest takes at that pace
    const cl=chlog[c],m=META[c-1];if(!R||!cl||!cl.s||!cl.e||!m)return null;
    const days=Math.max(1,R.daysBetween(cl.s,cl.e)+1),perDay=m.verses_count/days;
    let left=0;for(let k=chStart[c]+m.verses_count;k<N;k++)if(inPlan(SEC[k]))left++;
    return {c,name:m.name,days,perDay,rest:Math.ceil(left/perDay),left};
  }
  const chapterLine=r=>r?`Read in ${r.days} ${r.days===1?'day':'days'} · ${R.fmt(r.perDay)} shlokas a day`+
    (r.left?`. At this rate the rest of ${R.scope(plan)} takes ${r.rest} ${r.rest===1?'day':'days'}.`:'.'):'';
  // Where the reader is, what comes next and what is left: everything a reminder can be written from.
  function readingState(){
    let i=lastI>=0&&lastI<N?lastI:Math.max(0,idx);while(i>0&&SEC[i].t!=='v')i--;
    const at=SEC[i];let j=i+1;while(j<N&&!inPlan(SEC[j]))j++;
    const nx=j<N?SEC[j]:null;let left=0;for(let k=i+1;k<N;k++)if(inPlan(SEC[k]))left++;
    const cur=chData.get(at.c)?chData.get(at.c)[at.i]:null,nv=nx&&chData.get(nx.c)?chData.get(nx.c)[nx.i]:null;
    if(nx&&!nv)ensureChapter(nx.c).then(shareState,()=>{}); // the next shloka's question arrives with its chapter
    const atEnd=at.i+1>=at.m.verses_count,nm=nx&&nx.c!==at.c?nx.m:null;
    return Object.assign({},shared||{},plan,{lastRead,day:dayRec.d,count:dayRec.seen.length,
      pos:{c:at.c,v:at.i+1,name:at.m.name,meaning:at.m.meaning,count:at.m.verses_count},
      essence:cur?cur.essence:'',
      next:nx?{c:nx.c,v:nx.i+1,hook:nv&&nv.hook||'',lead:nv&&R?R.firstSentence(nv.background):''}:null,
      nextChapter:atEnd&&nm?{c:nm.chapter,name:nm.name,meaning:nm.meaning,opening:R?R.firstSentence(nm.teaching):''}:null,
      left:{chapter:at.m.verses_count-(at.i+1),plan:left},done:left===0,
      hist:Object.fromEntries(Object.keys(hist).sort().slice(-30).map(k=>[k,hist[k]])),
      // a second copy of everything the reader built up, in case the browser clears localStorage (see restore below)
      keep:{v:1,plan,pos:parse('gita-pos',null),marks:[...markSet],read:[...readSet],hist,chlog,lastI,lastRead,
        day:dayRec,chlast:+store.get('gita-chlast')||0,tapped,swh:swipeHints,savedOnce:!!store.get('gita-saved-once'),visits:+store.get('gita-visits')||0},
      chapter:(r=>r?{c:r.c,name:r.name,days:r.days,perDay:r.perDay}:null)(chapterRecord(at.c))});
  }
  function shareState(){
    clearTimeout(shareT);
    shareT=setTimeout(()=>{if(!shared)return;shared=readingState();store.setShared(shared)},400);
  }
  const savePlan=()=>{store.set('gita-plan',JSON.stringify(plan));shareState()};

  const feed=$('#feed');
  feed.innerHTML=SEC.map((s,i)=>`<section class="s" data-i="${i}"></section>`).join('');
  const secEls=feed.children;

  function verseHTML(s,v){
    const sp=v.speaker?`<div class="speaker">${esc(v.speaker)}</div>`:'';
    const mk=`${s.c}:${v.verse}`;
    const star=`<button class="mark ${markSet.has(mk)?'on':''}" data-act="mark" data-c="${s.c}" data-v="${v.verse}" aria-label="bookmark">★</button>`;
    const bell=`<button class="cfg ${plan.on?'on':''}" data-act="settings" aria-label="reading plan">${BELL}</button>`;
    const tap=!tapped?`<div class="hint hint-tap">tap to reveal more</div>`
      :swipeHints>0&&!store.get('gita-saved-once')?`<div class="hint hint-swipe">swipe left to save</div>`:'';
    const scroll=(s.c===1&&v.verse===1&&firstRun)?`<div class="hint hint-scroll"><span class="chev">⌄</span>scroll down</div>`:'';
    return `<div class="card" data-act="open">
      ${star}${bell}<button class="ref" data-act="index">अध्याय ${dn(s.c)} · श्लोक ${dn(v.verse)}</button>
      ${sp}<div class="dev">${dev(v.devanagari)}</div>
      <div class="iast">${esc(v.transliteration)}</div>
      <div class="ess">${esc(v.essence)}</div>${v.connection?`<div class="thread">${em(v.connection)}</div>`:''}</div>${tap}${scroll}`;
  }
  function ceHTML(s){
    const m=s.m;
    const qs=m.reflections.map((q,i)=>`<div class="q"><b>${dn(i+1)}</b><span>${esc(q)}</span></div>`).join('');
    const nxt=s.c<18?`<div class="next">स्वस्ति · swipe up — अध्याय ${dn(s.c+1)}</div>`:`<div class="next">स्वस्ति · swipe up</div>`;
    return `<div class="ce"><div class="chno">॥ अध्याय ${dn(s.c)} सम्पूर्ण ॥</div>
      <h2>${esc(m.name)}</h2><div class="chmean">${esc(m.transliteration)} · ${esc(m.meaning)}</div>
      <div class="cestat">${esc(chapterLine(chapterRecord(s.c)))}</div>
      <div class="teach">${esc(m.teaching)}</div>${m.key_verses?`<div class="kv">सारश्लोकाः · ${esc(m.key_verses)}</div>`:''}<div class="rline"></div>${qs}${nxt}</div>`;
  }
  const finHTML=()=>`<div class="card colo"><div class="dev">॥ इति श्रीमद्भगवद्गीता ॥</div>
    <div class="sub">aṣṭādaśa adhyāyāḥ · sapta-śata ślokāḥ<br>hari oṁ tat sat</div></div>`;

  function fill(i){
    const el=secEls[i];if(!el||el.dataset.live)return;
    const s=SEC[i];
    if(s.t==='fin'){el.innerHTML=finHTML();el.dataset.live=1;return}
    if(s.t==='ce'){el.innerHTML=ceHTML(s);el.dataset.live=1;return}
    const vs=chData.get(s.c);
    if(vs){el.innerHTML=verseHTML(s,vs[s.i]);el.dataset.live=1}
    else{
      el.innerHTML=`<div class="card"><div class="ref">अध्याय ${dn(s.c)} · श्लोक ${dn(s.i+1)}</div><div class="iast">…</div></div>`;
      el.dataset.live=1;el.dataset.stub=1;
      ensureChapter(s.c).then(()=>{if(el.dataset.stub){delete el.dataset.live;delete el.dataset.stub;if(live.has(i))fill(i)}},
        ()=>{if(el.dataset.stub){delete el.dataset.live;delete el.dataset.stub;live.delete(i)}}); // refilled on the next swipe
    }
  }
  function clearSec(i){const el=secEls[i];if(el&&el.dataset.live){el.innerHTML='';delete el.dataset.live;delete el.dataset.stub}}
  const live=new Set();
  function windowAt(i){
    const lo=Math.max(0,i-6),hi=Math.min(N-1,i+6);
    for(const j of [...live])if(j<lo||j>hi){clearSec(j);live.delete(j)}
    for(let j=lo;j<=hi;j++)if(!live.has(j)){fill(j);live.add(j)}
  }

  const bg=$('#bg'),layers=[$('#fA'),$('#fB')];let activeL=0,curCh=0;
  const formHTML=p=>p.fx.map(f=>{
    const tx=f.cc?'translate(-50%,-50%)':'';const rot=f.rot?` rotate(${f.rot})`:'';
    return `<div class="fx" style="width:${f.w};height:${f.h};left:${f.x};top:${f.y};border-radius:${f.r};background:${f.g};transform:${tx}${rot}"></div>`}).join('');
  function paletteTo(c){
    if(c===curCh)return;curCh=c;
    const p=PAL[c],r=document.documentElement.style;
    r.setProperty('--bg',p.bg);r.setProperty('--ink',p.ink);r.setProperty('--mut',p.mut);
    r.setProperty('--acc',p.acc);r.setProperty('--fop',p.fop);
    document.querySelector('meta[name=theme-color]')?.setAttribute('content',p.bg);
    const nxt=layers[1-activeL],cur=layers[activeL];
    nxt.querySelector('.fxwrap').innerHTML=formHTML(p);
    nxt.classList.add('on');cur.classList.remove('on');activeL=1-activeL;
  }

  let idx=-1,H=feed.clientHeight;
  const chProgress=s=>s.t==='v'?(s.i+1)/s.m.verses_count:1;
  const labelFor=s=>s.t==='fin'?'॥ ॐ तत्सत् ॥':s.t==='ce'?`अध्याय ${dn(s.c)} · सम्पूर्ण`:`अध्याय ${dn(s.c)} · श्लोक ${dn(s.i+1)} / ${dn(s.m.verses_count)}`;
  function setIdx(i,save=true){
    if(i===idx||i<0||i>=N||Number.isNaN(i))return;
    idx=i;const s=SEC[i];
    windowAt(i);
    paletteTo(s.t==='fin'?18:s.c);
    bg.classList.toggle('resolved',s.t==='ce'||s.t==='fin');
    $('#pbar').style.width=(chProgress(s)*100)+'%';
    $('#plabel').textContent=labelFor(s);
    if(s.t==='ce'&&!readSet.has(s.c)){readSet.add(s.c);store.set('gita-read',JSON.stringify([...readSet]))}
    if(s.t==='ce'){ // arriving at the end of a chapter closes its record, and the card shows it
      const cl=chlog[s.c];if(cl&&cl.s&&!cl.e){cl.e=todayKey();store.set('gita-chlog',JSON.stringify(chlog));store.set('gita-chlast',String(s.c));shareState()}
      const el=secEls[i]&&secEls[i].querySelector('.cestat');if(el)el.textContent=chapterLine(chapterRecord(s.c));
    }
    if(save)store.set('gita-pos',JSON.stringify({i}));
    noteRead(i);
    if(s.t==='v'&&tapped&&swipeHints>0&&!store.get('gita-saved-once')){ // the swipe hint shows on a few shlokas, then retires
      store.set('gita-swh',String(--swipeHints));if(!swipeHints)root.querySelectorAll('.hint-swipe').forEach(el=>el.remove())}
  }

  let raf=0;
  feed.addEventListener('scroll',()=>{
    if(raf)return;
    raf=requestAnimationFrame(()=>{
      raf=0;if(!H){H=feed.clientHeight;if(!H)return}
      const t=feed.scrollTop,i=Math.round(t/H);
      setIdx(i);
      const s=SEC[Math.min(Math.max(i,0),N-1)];
      if(s&&s.t==='v'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
        const f=((t/H)-chStart[s.c])/s.m.verses_count;
        const w=layers[activeL].querySelector('.fxwrap');
        if(w)w.style.transform=`translateY(${(f-.5)*4}%) rotate(${(f-.5)*2}deg)`;
      }
    });
  });
  addEventListener('resize',()=>{H=feed.clientHeight;feed.scrollTop=idx*H});

  const xp=$('#xp'),xpinner=$('#xpinner');let xpOpen=false;
  async function openXP(s,x,y){
    if(!tapped){tapped=true;store.set('gita-tapped','1');
      root.querySelectorAll('.hint-tap').forEach(el=>el.remove())}
    const vs=await ensureChapter(s.c);const v=vs[s.i];
    let h=`<button class="ref">अध्याय ${dn(s.c)} · श्लोक ${dn(v.verse)}</button>`;
    if(v.speaker)h+=`<div class="speaker">${esc(v.speaker)}</div>`;
    h+=`<div class="dev">${dev(v.devanagari)}</div><div class="iast">${esc(v.transliteration)}</div>`;
    const sec=(lab,cls,body)=>body?`<div class="xsec"><div class="xlab">${lab}</div><div class="${cls}">${em(body)}</div></div>`:'';
    // teaching tab
    let t=sec('प्रश्न · the question this verse answers','xhook',v.hook)+sec('अनुवाद · translation','xbody',v.translation)+sec('व्याख्या · the teaching','xbody',v.explanation);
    t+=sec('सम्बन्ध · the thread','xnote',v.connection)+sec('प्रसङ्ग · the background','xnote',v.background)+sec('भावना · take it inward','xnote bh',v.reflection);
    if(v.views&&v.views.length)t+=`<div class="xsec"><div class="xlab">दृष्टिभेद · ways of seeing</div>`+
      v.views.map(w=>{const L=LENS[w.lens]||[w.lens,''];
        return `<div class="view"><div class="vlens">${L[0]}<span>${L[1]}</span></div><div class="xnote">${esc(w.text)}</div></div>`}).join('')+`</div>`;
    else t+=sec('दृष्टिभेद · ways of seeing','xnote',v.schools_note);
    if(v.refs&&v.refs.length)t+=`<div class="xsec"><div class="xlab">प्रमाण · texts cited</div>`+
      v.refs.map(r=>`<div class="xref"><b>${esc(r.source)}</b><div class="xnote">${esc(r.note)}</div></div>`).join('')+
      `<div class="xsrc"><p>As cited in Swami Mukundananda’s commentary (holy-bhagavad-gita.org); notes are paraphrases.</p></div></div>`;
    const ck=(v.checked||'').split('').map(k=>CHK[k]).filter(Boolean);
    const who=[...new Set((v.views||[]).map(w=>(LENS[w.lens]||[])[2]).filter(Boolean))];
    t+=`<details class="xsec"><summary class="xlab">स्रोत · sources</summary><div class="xsrc">`+
      (ck.length?`<p>Sanskrit text checked against ${esc(ck.join('; '))}.</p>`:'')+
      (v.text_note?`<p>${esc(v.text_note)}</p>`:'')+
      `<p>Translation: Swami Sivananda, The Bhagavad Gita (Divine Life Society).</p>`+
      (who.length?`<p>Ways of seeing drawn from the commentaries of ${esc(who.join('; '))}. They are short paraphrases, not quotations.</p>`:'')+
      `<p>Teaching, thread and word notes are written for this reader.</p></div></details>`;
    // word-by-word tab
    let w='';
    if(v.anvaya&&v.anvaya.length){
      w=`<div class="xsec"><table class="anv">`+
        v.anvaya.map(a=>{
          const g=[a.base&&a.base.includes('·')?a.base:'',a.form].filter(Boolean).join(' — ');
          return `<tr><td>${esc(a.word)}${a.iast?`<small>${esc(a.iast)}</small>`:''}</td><td><span class="wm">${esc(a.meaning)}</span>`+
            (g?`<span class="wg">${esc(g)}</span>`:'')+(a.parts?`<span class="wg">${esc(a.parts)}</span>`:'')+`</td></tr>`}).join('')+`</table></div>`;
    }
    if(w)h+=`<div class="xtabs" role="tablist"><button role="tab" data-tab="t">व्याख्या · teaching</button><button role="tab" data-tab="w">शब्दार्थ · word by word</button></div>`;
    h+=`<div class="xpane" data-pane="t">${t}</div>`+(w?`<div class="xpane" data-pane="w">${w}</div>`:'');
    const si=SEC.indexOf(s);
    h+=si<N-1?`<button class="xnext"><span>॥</span>keep scrolling · अगला श्लोक<i class="eye">${EYE}</i></button>`:`<div class="xend">॥</div>`;
    xp.dataset.i=si;
    xpinner.innerHTML=h;setTab('t'); // every verse opens on the teaching
    xp.style.setProperty('--cx',x+'px');xp.style.setProperty('--cy',y+'px');
    xp.classList.add("show");xp.scrollTop=0;xpOpen=true; // reset after show: scrollTop on a display:none box is ignored
    requestAnimationFrame(()=>requestAnimationFrame(()=>xp.classList.add('open')));
  }
  function setTab(k){
    xpinner.querySelectorAll('.xpane').forEach(el=>el.hidden=el.dataset.pane!==k);
    xpinner.querySelectorAll('.xtabs button').forEach(el=>el.setAttribute('aria-selected',el.dataset.tab===k));
  }
  // ---- reading on: pull past the end of a teaching, like pull-to-refresh, with an eye for the spinner.
  // The eye at the end opens as you pull; on release it blinks shut while the page changes and opens on the next shloka.
  const eye=$('#eye'),veil=$('#veil');let advancing=false;
  const endEye=()=>xpinner.querySelector('.xnext .eye');
  const setPull=d=>{const e=endEye();if(!e)return; // d = pixels pulled past the end
    e.classList.toggle('drag',d>0);
    if(d>0)e.style.setProperty('--o',Math.min(1,.12+d/90*.88).toFixed(2));else e.style.removeProperty('--o')};
  function nextFromXP(){
    const to=+xp.dataset.i+1;
    if(advancing||!xpOpen||!(to<N))return;advancing=true;
    const go=()=>{xpOpen=false;xp.classList.remove('open','show');feed.scrollTop=to*H;setIdx(to)};
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){go();advancing=false;return}
    // carry the eye over the page change: a fixed copy takes the place of the one at the end of the teaching
    const src=endEye(),r=src&&src.getBoundingClientRect();
    eye.style.left=(r?r.left+r.width/2:innerWidth/2)+'px';
    eye.style.top=(innerHeight-30)+'px'; // settles on the footer line, whose label steps aside meanwhile
    eye.style.setProperty('--o',src&&src.style.getPropertyValue('--o')||'.12');
    eye.classList.add('on');root.classList.add('eyeing');if(src)src.style.visibility='hidden';
    veil.classList.add('on');
    requestAnimationFrame(()=>requestAnimationFrame(()=>eye.style.setProperty('--o','.05'))); // shut: a closed lid, still visible
    setTimeout(()=>{go();veil.classList.remove('on');eye.classList.add('wake');eye.style.setProperty('--o','1'); // open, slowly, on the next shloka
      setTimeout(()=>{eye.classList.remove('on');root.classList.remove('eyeing');advancing=false;
        setTimeout(()=>eye.classList.remove('wake'),400)},1250);
    },380);
  }
  const atEnd=()=>xp.scrollTop+xp.clientHeight>=xp.scrollHeight-4;
  let wheelPast=0,wheelT=0;
  xp.addEventListener('wheel',e=>{ // mouse and trackpad: keep scrolling at the end
    if(!atEnd()||e.deltaY<=0){wheelPast=0;return}
    wheelPast+=e.deltaY;setPull(wheelPast/260*90);clearTimeout(wheelT);wheelT=setTimeout(()=>{wheelPast=0;if(!advancing)setPull(0)},400);
    if(wheelPast>260){wheelPast=0;nextFromXP()}
  },{passive:true});
  function closeXP(){if(!xpOpen)return;xpOpen=false;xp.classList.remove('open');
    setTimeout(()=>{if(!xpOpen)xp.classList.remove('show')},620)}
  let xtY=0,xtS=0,xtEnd=false,xMoved=false;
  xp.addEventListener('touchstart',e=>{xtY=e.touches[0].clientY;xtS=xp.scrollTop;xtEnd=atEnd();xMoved=false},{passive:true});
  xp.addEventListener('touchmove',e=>{const dy=e.touches[0].clientY-xtY;
    if(Math.abs(dy)>8)xMoved=true;if(xtS<=0&&dy>72)closeXP();
    if(xtEnd){setPull(-dy);if(dy<-90)nextFromXP()}},{passive:true}); // pulling up past the end opens the eye
  xp.addEventListener('touchend',()=>{if(!advancing)setPull(0)},{passive:true});
  xp.addEventListener('click',e=>{
    if(e.target.closest('.xnext')){nextFromXP();return}
    if(e.target.closest('summary'))return; // opening the sources list must not close the page
    const tb=e.target.closest('.xtabs button');
    if(tb){setTab(tb.dataset.tab);return}
    if(!xMoved&&!String(getSelection()))closeXP()}); // selecting text to copy must not close it

  const ix=$('#ix'),ixrows=$('#ixrows');let ixOpen=false,ixExpanded=0;
  function renderIX(){
    const cur=SEC[idx]||{},curC=cur.c||1,curV=cur.t==='v'?cur.i+1:0;
    let saved='';
    if(markSet.size){
      const cells=[...markSet].map(k=>k.split(':').map(Number)).sort((a,b)=>a[0]-b[0]||a[1]-b[1])
        .map(([c,v])=>`<button class="vcell" data-c="${c}" data-v="${v}">${dn(c)}·${dn(v)}</button>`).join('');
      saved=`<div class="ixsaved"><h4>★ saved · सङ्गृहीताः</h4><div class="vgrid wide">${cells}</div></div>`;
    }
    ixrows.innerHTML=saved+META.map(m=>{
      const open=m.chapter===ixExpanded;
      const grid=open?`<div class="vgrid">`+Array.from({length:m.verses_count},(_,k)=>{
        const vn=k+1,on=m.chapter===curC&&vn===curV;
        return `<button class="vcell ${on?'cur':''}" data-c="${m.chapter}" data-v="${vn}">${dn(vn)}</button>`;
      }).join('')+`</div>`:'';
      return `<div class="ixgroup ${open?'open':''}">
        <button class="ixrow ${m.chapter===curC?'cur':''}" data-c="${m.chapter}">
          <span class="no">${dn(m.chapter)}</span>
          <span class="nm">${esc(m.name)}<small>${esc(m.meaning)} · ${dn(m.verses_count)} श्लोकाः</small></span>
          <span class="cv">⌄</span>
          <span class="dot ${readSet.has(m.chapter)?'read':''}"></span></button>${grid}</div>`;
    }).join('');
  }
  function openIX(){ixExpanded=SEC[idx]?.c||0;renderIX();ix.classList.add('show');ixOpen=true;
    requestAnimationFrame(()=>requestAnimationFrame(()=>ix.classList.add('open')))}
  function closeIX(){if(!ixOpen)return;ixOpen=false;ix.classList.remove('open');
    setTimeout(()=>{if(!ixOpen)ix.classList.remove('show')},420)}
  ix.addEventListener('click',e=>{
    const cell=e.target.closest('.vcell');
    if(cell){closeIX();jumpTo(chStart[+cell.dataset.c]+(+cell.dataset.v-1));return}
    const r=e.target.closest('.ixrow');
    if(!r){closeIX();return}
    const c=+r.dataset.c;
    ixExpanded=ixExpanded===c?0:c;
    renderIX();
  });
  function jumpTo(i){
    const veil=$('#veil');veil.classList.add('on');
    setTimeout(()=>{feed.scrollTop=i*H;setIdx(i);
      setTimeout(()=>veil.classList.remove('on'),120)},360);
  }

  feed.addEventListener('click',e=>{
    const act=e.target.closest('[data-act]');if(!act)return;
    if(act.dataset.act==='index'){e.stopPropagation();openIX();return}
    if(act.dataset.act==='settings'){e.stopPropagation();openST();return}
    if(act.dataset.act==='mark'){e.stopPropagation();toggleMark(+act.dataset.c,+act.dataset.v,act);return}
    if(act.dataset.act==='open'){
      const sec=e.target.closest('section.s');
      const s=SEC[+(sec?sec.dataset.i:idx)];
      if(s&&s.t==='v')openXP(s,e.clientX,e.clientY);
    }
  });
  $('#plabel').addEventListener('click',openIX);
  addEventListener('keydown',e=>{
    if(titleUp()){e.preventDefault();dismissTitle();return}
    if(e.key==='Escape'){closeXP();closeIX();closeST();return}
    if(xpOpen||ixOpen||stOpen)return;
    if(e.key==='b'){const sec=SEC[idx];if(sec&&sec.t==='v')toast(toggleMark(sec.c,sec.i+1)?'saved · सङ्गृहीतम्':'removed from saved')}
    if(['ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();feed.scrollTo({top:(idx+1)*H,behavior:'smooth'})}
    if(['ArrowUp','PageUp'].includes(e.key)){e.preventDefault();feed.scrollTo({top:(idx-1)*H,behavior:'smooth'})}
    if(e.key==='Enter'){const s=SEC[idx];if(s&&s.t==='v')openXP(s,innerWidth/2,innerHeight/2)}
  });

  let start=0;
  try{const p=JSON.parse(store.get('gita-pos'));if(p&&p.i>=0&&p.i<N)start=p.i}catch(e){}
  const s0=SEC[start];
  await ensureChapter(s0.t==='fin'?18:s0.c).catch(()=>{}); // offline: show stubs, retry on swipe
  H=feed.clientHeight;
  paletteTo(s0.t==='fin'?18:s0.c);
  setIdx(start,false);
  if(start>0)feed.scrollTop=start*H;

  // ---- install offer: from the second visit, on every visit until the app is installed ----
  // The browser's own address-bar install button needs nothing from us beyond the manifest and service worker.
  const sess={get(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}};
  if(!sess.get('gita-seen')){sess.set('gita-seen','1');store.set('gita-visits',String((+store.get('gita-visits')||0)+1))}
  const installed=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  const returning=(+store.get('gita-visits')||0)>=2;
  const inst=$('#inst');let deferred=null;
  const offer=(text,canInstall)=>{$('#insttext').textContent=text;$('#instgo').hidden=!canInstall;inst.hidden=false};
  addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();deferred=e; // keep the event so the offer can open the real install dialog
    if(returning&&!installed)offer('Keep the Gita on your home screen. It reads offline.',true);
  });
  addEventListener('appinstalled',()=>{inst.hidden=true;deferred=null});
  $('#instgo').addEventListener('click',async()=>{
    if(!deferred)return;inst.hidden=true;
    deferred.prompt();await deferred.userChoice.catch(()=>{});deferred=null; // an event can be used once
  });
  $('#instno').addEventListener('click',()=>{inst.hidden=true}); // for this visit only
  // iOS Safari has no install event; show the manual steps instead
  if(returning&&!installed&&/iphone|ipad|ipod/i.test(navigator.userAgent)&&!('onbeforeinstallprompt' in window))
    offer('To keep the Gita on your home screen: tap Share, then Add to Home Screen.',false);

  // ---- saving a shloka: the star, a swipe to the left, or the b key ----
  const toastEl=$('#toast');let toastT=0;
  function toast(text){toastEl.textContent=text;toastEl.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>toastEl.classList.remove('on'),1600)}
  function toggleMark(c,v,el){
    const mk=`${c}:${v}`,on=!markSet.has(mk);
    if(on)markSet.add(mk);else markSet.delete(mk);
    saveMarks();store.set('gita-saved-once','1');
    const star=el||(secEls[idx]&&secEls[idx].querySelector('.mark'));if(star)star.classList.toggle('on',on);
    root.querySelectorAll('.hint-swipe').forEach(x=>x.remove());
    return on;
  }
  // The feed only scrolls up and down, so a quick sideways move to the left is free to mean "save this one".
  let sx=0,sy=0,sT=0;
  feed.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;sT=Date.now()},{passive:true});
  feed.addEventListener('touchend',e=>{
    const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy,sec=SEC[idx];
    if(dx<-70&&Math.abs(dy)<45&&Date.now()-sT<700&&sec&&sec.t==='v')toast(toggleMark(sec.c,sec.i+1)?'saved · सङ्गृहीतम्':'removed from saved');
  },{passive:true});

  // ---- the bell: reading plan and reminders ----
  // All of it is worked out on the device. Reminders reach a closed app only where the browser allows a background
  // wake-up (installed app on Android); elsewhere the reader gets the greeting on the title screen and a calendar file.
  const st=$('#st'),stin=$('#stin');let stOpen=false,syncOK=false;
  const canNotify='Notification' in window&&'serviceWorker' in navigator;
  const many=(n,w)=>`${n} ${w}${n===1?'':'s'}`;
  function deviceNote(){
    if(!canNotify)return /iphone|ipad|ipod/i.test(navigator.userAgent)
      ?'On iPhone, add the Gita to your home screen first (Share, then Add to Home Screen). Notifications are only possible from there.'
      :'This browser cannot show notifications.';
    if(Notification.permission==='denied')return 'Notifications are blocked for this site. Allow them in the browser’s site settings, then switch this on again.';
    if(!plan.on)return '';
    return syncOK?`Your phone shows the reminder about once a day, some time after ${plan.time}. It picks the moment itself, so it will not be exact.`
      :'This device does not let a web app notify while it is closed. For an exact time, add the calendar reminder below. When you open the app, it shows where you left off.';
  }
  async function armSync(){ // ask the browser to wake the worker now and then; it agrees only for an installed app
    syncOK=false;
    try{
      const reg=await navigator.serviceWorker.ready;if(!('periodicSync' in reg))return;
      if(plan.on&&Notification.permission==='granted'){await reg.periodicSync.register('gita-remind',{minInterval:12*36e5});syncOK=true}
      else await reg.periodicSync.unregister('gita-remind');
    }catch(e){syncOK=false}
  }
  function renderST(){
    const now=new Date(),rs=readingState(),left=rs.left.plan;
    const pc=R?R.pace(left,plan.perDay,now,rs.count):{days:0,date:''},msg=R?R.pick(rs,now):null,what=R?R.scope(plan):'the Gita';
    const opts=sel=>META.map(m=>`<option value="${m.chapter}"${m.chapter===sel?' selected':''}>${dn(m.chapter)} · ${esc(m.name)}</option>`).join('');
    const two=n=>String(n).padStart(2,'0');
    const when=t=>{const d=new Date(t);return `${d.getDate()} ${d.toLocaleString('en',{month:'short'})}, ${two(d.getHours())}:${two(d.getMinutes())}`};
    const card=(small,m)=>`<div class="stmsg"><small>${esc(small)}</small><b>${esc(m.title)}</b><span>${esc(m.body)}</span></div>`;
    const log=(shared&&shared.sent&&shared.sent.log)||[],note=deviceNote();
    const run=R?R.streak(hist,todayKey()):0,avg=R?R.rate(hist,todayKey()):0;
    const real=avg>=0.5?R.pace(left,Math.max(1,Math.round(avg)),now,rs.count):null;
    const last=chapterRecord(+store.get('gita-chlast')||0);
    const remind=canNotify&&!iOS; // iPhone cannot be reminded by a web app, so it gets no reminder settings
    stin.innerHTML=`<div class="sthead"><h3>${remind?'स्मरण · reading plan and reminders':'पाठ · reading plan'}</h3><button data-st="close">done</button></div>
      <div class="stsec"><div class="xlab">प्रगति · your reading</div>
        <div class="ststats"><div><b>${run}</b><span>${run===1?'day':'days'} in a row</span></div>
          <div><b>${rs.day===todayKey()?rs.count:0}<i> / ${plan.perDay}</i></b><span>read today</span></div>
          <div><b>${avg?R.fmt(avg):'–'}</b><span>a day, lately</span></div></div>
        ${real&&left?`<div class="stnote">At the pace you have actually kept, about ${R.fmt(avg)} a day, you finish ${what} on ${real.date}.</div>`:''}
        ${last?`<div class="stnote">अध्याय ${dn(last.c)} · ${esc(last.name)}: ${esc(chapterLine(last).replace(/^R/,'r'))}</div>`:''}</div>
      <div class="stsec"><div class="xlab">पाठ · what to read</div>
        <div class="stline"><label>from <select data-st="from">${opts(plan.from)}</select></label></div>
        <div class="stline"><label>to <select data-st="to">${opts(plan.to)}</select></label></div></div>
      <div class="stsec"><div class="xlab">गति · how much a day</div>
        <div class="stline"><button class="stb" data-st="less" aria-label="one fewer">−</button><b class="stnum">${plan.perDay}</b><span>${plan.perDay===1?'shloka':'shlokas'} a day</span><button class="stb" data-st="more" aria-label="one more">+</button></div>
        <div class="stline"><label>or finish in <input data-st="days" type="number" inputmode="numeric" min="1" max="999" value="${pc.days||''}"> days</label></div>
        <div class="stnote">${left?`${many(left,'shloka')} left in ${what}. At this pace you finish on ${pc.date}.`:`You have read all of ${what}.`}</div>
        ${remind?'':`<div class="stline stacts"><button data-st="ics">add a daily reminder to my calendar</button></div>
        <div class="stnote">${iOS?'iPhone does not let a web app send reminders, so there are none to set here.':'This browser cannot show notifications.'} A calendar reminder at a time you choose does the job, and the app shows where you left off when you open it.</div>`}</div>
      ${remind?`<div class="stsec"><div class="xlab">सूचना · reminders</div>
        <div class="stline"><span>Remind me to read</span><button class="stsw" role="switch" aria-checked="${plan.on}" aria-label="remind me to read" data-st="on"><i></i></button></div>
        <div class="stline"><label>not before <input data-st="time" type="time" value="${plan.time}"></label></div>
        <div class="stnote">At most one a day. None once today’s reading is done, none late at night, and fewer if they go unanswered.</div>
        ${note?`<div class="stnote">${esc(note)}</div>`:''}
        ${msg?card('the next one would say',msg):''}
        <div class="stline stacts"><button data-st="test">show me one now</button><button data-st="ics">add a daily reminder to my calendar</button></div></div>
      <div class="stsec"><div class="xlab">recent reminders</div>
        ${log.length?log.map(l=>card(when(l.t),l)).join(''):'<div class="stnote">None sent yet.</div>'}</div>`:''}
      <div class="stsec"><div class="xlab">मार्गदर्शन · how to read</div><ul class="stguide">
        <li><b>Swipe up</b> for the next shloka, down for the one before.</li>
        <li><b>Tap a shloka</b> for its teaching and its word-by-word. Pull past the end of the teaching to go on to the next shloka.</li>
        <li><b>Swipe left</b>, or tap ★, to save a shloka. Saved shlokas are listed at the top of the index.</li>
        <li><b>Tap the chapter line</b> above a shloka for the index of all eighteen chapters.</li>
        <li><b>Tap the bell</b> for this page: your plan, your streak and your pace.</li></ul></div>`;
  }
  function openST(){renderST();st.classList.add('show');st.scrollTop=0;stOpen=true;
    requestAnimationFrame(()=>requestAnimationFrame(()=>st.classList.add('open')));
    armSync().then(()=>{if(stOpen)renderST()})}
  function closeST(){if(!stOpen)return;stOpen=false;st.classList.remove('open');
    setTimeout(()=>{if(!stOpen)st.classList.remove('show')},420)}
  const refreshBells=()=>root.querySelectorAll('.cfg').forEach(el=>el.classList.toggle('on',plan.on));
  function calendarFile(){ // a daily event at the chosen time, for devices that cannot be reminded any other way
    const now=new Date(),two=n=>String(n).padStart(2,'0'),d=`${now.getFullYear()}${two(now.getMonth()+1)}${two(now.getDate())}`,[h,m]=plan.time.split(':');
    const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//gita//reading//EN','BEGIN:VEVENT',`UID:gita-reading@${location.hostname}`,
      `DTSTAMP:${d}T000000Z`,`DTSTART:${d}T${h}${m}00`,'DURATION:PT15M','RRULE:FREQ=DAILY',
      `SUMMARY:गीता · ${many(plan.perDay,'shloka')}`,`DESCRIPTION:Open ${location.origin}/ to read from where you left off.`,`URL:${location.origin}/`,
      'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:Time to read the Gita','TRIGGER:PT0M','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='gita-reading.ics';
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);
  }
  st.addEventListener('click',async e=>{
    const b=e.target.closest('[data-st]');
    if(!b){if(e.target===st)closeST();return}
    const k=b.dataset.st;
    if(k==='close'){closeST();return}
    if(k==='less'||k==='more'){plan.perDay=Math.min(700,Math.max(1,plan.perDay+(k==='more'?1:-1)));savePlan();renderST();return}
    if(k==='on'){
      if(plan.on)plan.on=false;
      else if(canNotify){ // the browser's own question appears here, once
        const perm=Notification.permission==='default'?await Notification.requestPermission():Notification.permission;
        plan.on=perm==='granted';
      }
      savePlan();await armSync();renderST();refreshBells();
      if(!plan.on&&!canNotify)toast('This device cannot show notifications');
      return;
    }
    if(k==='test'){
      if(!canNotify||Notification.permission!=='granted'){toast(canNotify?'Switch reminders on first':'This device cannot show notifications');return}
      shared=readingState();await store.setShared(shared);
      const reg=await navigator.serviceWorker.ready;if(reg.active)reg.active.postMessage({type:'remind-test'});
      toast('Sent');return;
    }
    if(k==='ics'){calendarFile();return}
  });
  st.addEventListener('change',e=>{
    const k=e.target.dataset.st,v=e.target.value;if(!k)return;
    if(k==='from'){plan.from=+v;if(plan.to<plan.from)plan.to=plan.from}
    if(k==='to'){plan.to=+v;if(plan.from>plan.to)plan.from=plan.to}
    if(k==='time'&&/^\d\d:\d\d$/.test(v))plan.time=v;
    if(k==='days'&&+v>=1&&R)plan.perDay=R.perDayFor(readingState().left.plan,+v);
    savePlan();renderST();if(k==='time')armSync();
  });

  // On opening: read what the worker last recorded, note that the reader is back, and greet them on the title screen.
  let holdTitle=false;
  // Ask the browser not to clear this site's storage when space runs low (granted to installed and well-used sites).
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{})}catch(e){}
  store.getShared().then(saved=>{
    shared=saved||{};
    // localStorage came back empty but the second copy is there: put the reader's record back and start again from it.
    const k=shared.keep;
    if(k&&k.v===1&&store.get('gita-plan')==null&&store.get('gita-pos')==null&&!store.get('gita-restored')){
      const put=(key,val)=>{if(val!=null)store.set(key,typeof val==='string'?val:JSON.stringify(val))};
      put('gita-plan',cleanPlan(k.plan));put('gita-pos',k.pos);put('gita-marks',k.marks);put('gita-read',k.read);put('gita-days',k.hist);
      put('gita-chlog',k.chlog);put('gita-lasti',k.lastI);put('gita-last',String(k.lastRead||0));put('gita-day',k.day);
      if(k.chlast)put('gita-chlast',String(k.chlast));if(k.tapped)put('gita-tapped','1');if(k.savedOnce)put('gita-saved-once','1');
      put('gita-swh',String(k.swh==null?6:k.swh));put('gita-visits',String(k.visits||1));
      store.set('gita-restored','1');location.reload();return; // once: the flag stops a loop if storage is not writable
    }
    store.set('gita-restored','');
    const g=R&&!firstRun?R.greeting(readingState(),new Date()):'',el=$('#tback');
    if(g&&el){el.textContent=g;holdTitle=true}
    if(R)shared=R.recordOpen(shared,new Date());
    shareState();if(plan.on)armSync();
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='hidden'){clearTimeout(shareT);if(shared){shared=readingState();store.setShared(shared)}}
    else store.getShared().then(saved=>{shared=R?R.recordOpen(saved||shared||{},new Date()):saved||{};shareState()});
  });

  // ---- title splash ----
  function titleUp(){const t=root.querySelector('#title');return !!t&&!t.classList.contains('hide')}
  function dismissTitle(){
    const t=root.querySelector('#title');if(!t||t.classList.contains('hide'))return;
    t.classList.add('hide');setTimeout(()=>t.remove(),650);
  }
  const titleEl=$('#title');
  if(titleEl){
    titleEl.addEventListener('click',dismissTitle);
    // attach scroll-to-dismiss after the initial programmatic scroll has settled
    setTimeout(()=>{if(titleUp())feed.addEventListener('scroll',dismissTitle,{once:true,passive:true})},150);
    if(!firstRun)setTimeout(()=>{if(holdTitle)setTimeout(dismissTitle,2200);else dismissTitle()},1400);
  }
}
