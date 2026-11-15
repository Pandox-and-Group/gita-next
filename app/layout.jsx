import './globals.css';

export const metadata = {
  title: 'गीता — a sacred book you scroll through',
  description: 'The Bhagavad Gita, one shloka at a time.',
  manifest: '/manifest.webmanifest',
  icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }, { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }], apple: '/apple-touch-icon.png' },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'गीता' },
};
export const viewport = {
  width: 'device-width', initialScale: 1, viewportFit: 'cover',
  themeColor: '#2b2b2e',
};

export default function RootLayout({ children }) {
  return (
    <html lang="sa">
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html:
          `if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
// A page kept open across a deploy asks for script files the new deploy no longer has. Reload once to get the new page.
(function(){function heal(m){if(!/ChunkLoadError|Loading chunk [\\w-]+ failed/.test(String(m)))return;
var t=0;try{t=+sessionStorage.getItem('gita-healed')||0}catch(e){}
if(Date.now()-t<60000)return; // already tried a moment ago: do not loop
try{sessionStorage.setItem('gita-healed',String(Date.now()))}catch(e){}
location.reload()}
addEventListener('error',function(e){heal((e.error&&(e.error.name+' '+e.error.message))||e.message)});
// a script tag that fails to load reports only on the tag itself, so listen in the capture phase too
addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='SCRIPT'&&(t.src||'').indexOf('/_next/static/')>-1)heal('ChunkLoadError '+t.src)},true);
addEventListener('unhandledrejection',function(e){var r=e.reason;heal(r&&(r.name+' '+r.message)||r)})})();`
        }} />
      </body>
    </html>
  );
}
