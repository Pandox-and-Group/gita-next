# Compares every verse's Sanskrit, transliteration and translation with outside editions.
# Usage: python3 scripts/compare-editions.py <app dir> <sources dir> <out.json>
# <sources dir> must hold: vs/repo (git clone of vedicscriptures/bhagavad-gita),
# gg/verse.json (from gita/gita, data/), gretil/bhgce.htm (GRETIL bhgce__u.htm). See docs/AUDIT.md.
import json,re,sys,html,unicodedata,difflib
APP,SRC=sys.argv[1],sys.argv[2]
V='अ a आ ā इ i ई ī उ u ऊ ū ऋ ṛ ॠ ṝ ऌ ḷ ए e ऐ ai ओ o औ au'.split()
VOW=dict(zip(V[::2],V[1::2]))
M='ा ā ि i ी ī ु u ू ū ृ ṛ ॄ ṝ ॢ ḷ े e ै ai ो o ौ au'.split()
MAT=dict(zip(M[::2],M[1::2]))
C='क k ख kh ग g घ gh ङ ṅ च c छ ch ज j झ jh ञ ñ ट ṭ ठ ṭh ड ḍ ढ ḍh ण ṇ त t थ th द d ध dh न n प p फ ph ब b भ bh म m य y र r ल l व v श ś ष ṣ स s ह h ळ ḷ'.split()
CON=dict(zip(C[::2],C[1::2]))
def iast(s):
    s=unicodedata.normalize('NFC',s);o=[];i=0
    while i<len(s):
        ch=s[i]
        if ch in CON:
            o.append(CON[ch]);n=s[i+1] if i+1<len(s) else ''
            if n=='्':i+=1
            elif n in MAT:o.append(MAT[n]);i+=1
            else:o.append('a')
        elif ch in VOW:o.append(VOW[ch])
        elif ch=='ं':o.append('ṃ')
        elif ch=='ः':o.append('ḥ')
        elif ch=='ऽ':o.append("'")
        elif ch=='ँ':o.append('m̐')
        else:o.append(ch)
        i+=1
    return ''.join(o)
def norm(t,loose=True):
    t=unicodedata.normalize('NFC',t.lower()).replace('ṁ','ṃ').replace('’',"'")
    t=re.sub(r"[\s\-।॥|.,;:!?\d०-९'‘‌‍/()\[\]]",'',t)
    if loose:
        t=re.sub(r'[ṅñṇnm](?=[kgcjṭḍtdpbmyrlvśṣsh])','ṃ',t)   # class nasal == anusvara
        t=re.sub(r'ṃ$','m',t)
    return t
UV=re.compile(r'^\s*(श्री\s*भगवानुवाच|अर्जुन उवाच|सञ्जय उवाच|संजय उवाच|धृतराष्ट्र उवाच)\s*[।|]*\s*',re.M)
def strip_uv(d):return UV.sub('',d)
app={}
for c in range(1,19):
    for v in json.load(open(f'{APP}/public/data/chapter-{c:02d}.json'))['verses']:app[(c,v['verse'])]=v
vs={};gg={}
for (c,n) in app:
    vs[(c,n)]=json.load(open(f'{SRC}/vs/repo/slok/bhagavadgita_chapter_{c}_slok_{n}.json'))
for r in json.load(open(f'{SRC}/gg/verse.json')):gg[(r['chapter_number'],r['verse_number'])]=r
# GRETIL
gr={};uv_gr={}
for line in open(f'{SRC}/gretil/bhgce.htm',encoding='utf8'):
    m=re.search(r'^(.*?)\s+Bhg_(\d\d)\.(\d\d\d)([a-z*]?)',html.unescape(line))
    if m:
        k=(int(m[2]),int(m[3]));
        if 'uvāca' not in m[1]:gr.setdefault(k,[]).append(m[1].strip())
print('gretil verses',len(gr),'ch13',sum(1 for k in gr if k[0]==13),file=sys.stderr)
out=[]
def add(k,layer,sev,msg):out.append({'c':k[0],'v':k[1],'layer':layer,'sev':sev,'msg':msg})
def dshow(a,b):
    sm=difflib.SequenceMatcher(None,a,b,autojunk=False);r=[]
    for tag,i1,i2,j1,j2 in sm.get_opcodes():
        if tag!='equal':r.append(f"…{a[max(0,i1-8):i1]}[{a[i1:i2]}→{b[j1:j2]}]{a[i2:i2+8]}…")
    return ' '.join(r)
per={}
for k,v in sorted(app.items()):
    c,n=k;p=per[k]={}
    d=strip_uv(v['devanagari']);a=norm(iast(d))
    # speaker
    has=bool(UV.search(v['devanagari']))
    if has and v.get('speaker'):add(k,'speaker','low','rubric both in devanagari and speaker field')
    if has and not v.get('speaker'):add(k,'speaker','low','rubric inside devanagari, speaker null: '+UV.search(v['devanagari'])[1])
    # L1a upstream
    u=norm(iast(strip_uv(re.sub(r'[\d०-९.]+','',vs[k]['slok']))))
    p['vs']=a==u
    if a!=u:add(k,'text-vs','med',dshow(a,u))
    # L1b gita/gita
    g=norm(iast(strip_uv(re.sub(r'[\d०-९.]+','',gg[k]['text']))))
    p['gg']=a==g
    if a!=g:add(k,'text-gg','med',dshow(a,g))
    # L1c gretil (critical ed, ch13 offset)
    gk=(c,n-1) if c==13 else k
    if gk in gr:
        t=norm(' '.join(gr[gk]));p['gretil']=a==t
        if a!=t:add(k,'text-gretil','med',dshow(a,t))
    else:p['gretil']=None
    # L2 translit
    t1=norm(iast(d),False);t2=norm(v['transliteration'],False)
    t2s=norm(re.sub(r'(?im)^\s*(śrī\s*bhagavān\s*uvāca|śrībhagavānuvāca|arjuna uvāca|sañjaya uvāca|saṃjaya uvāca|dhṛtarāṣṭra uvāca)\s*','',v['transliteration'].replace('ṁ','ṃ')),False)
    p['tr']=t1 in (t2,t2s)
    if not p['tr']:add(k,'translit','med',dshow(t1,t2s))
    # L3 translation
    sv=re.sub(r'^\s*\d+\.\d+\.?\s*','',vs[k]['siva']['et']).strip()
    w=lambda x:re.sub(r'\W+',' ',x.lower()).strip()
    p['siva']=w(sv)==w(v['translation'])
    if not p['siva']:add(k,'translation','med','APP: '+v['translation'][:400]+' || SIVA: '+sv[:400])

odd=[]
for k,v in sorted(app.items()):
    c,n=k;a=norm(iast(strip_uv(v['devanagari'])))
    g=norm(iast(strip_uv(re.sub(r'[\d०-९.]+','',gg[k]['text']))));gk=(c,n-1) if c==13 else k
    t=norm(' '.join(gr[gk])) if gk in gr else None
    if a!=g and a!=t: odd.append((k,'GG: '+dshow(a,g),'GRETIL: '+(dshow(a,t) if t else 'absent'), 'gg==gretil' if g==t else ''))
print('ODD (app matches neither gg nor gretil):',len(odd))
for o in odd:print(o[0],o[3],'|',o[1][:200],'|',o[2][:200])
json.dump({'issues':out,'per':{f'{k[0]}.{k[1]}':p for k,p in per.items()}},open(sys.argv[3],'w'),ensure_ascii=False,indent=1)
from collections import Counter
print(Counter(o['layer'] for o in out))
