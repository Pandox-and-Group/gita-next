// Renders public/icon.svg and public/badge.svg to the PNG icons, with the reader's own Devanagari font, because an
// SVG icon would fall back to whatever font the device has. Run it after changing either SVG:
//   node scripts/render-icons.cjs . [preview.png]
// It needs Playwright with Chromium on the machine (it is not a dependency of the app).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const app = process.argv[2], preview = process.argv[3];
  const pub = path.join(app, 'public');
  const font = fs.readFileSync(path.join(pub, 'fonts/tiro-devanagari-sanskrit-devanagari-400-normal.woff2')).toString('base64');
  const svg = fs.readFileSync(path.join(pub, 'icon.svg'), 'utf8'), badge = fs.readFileSync(path.join(pub, 'badge.svg'), 'utf8');
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: 1 });
  const css = `@font-face{font-family:'Tiro Devanagari Sanskrit';src:url(data:font/woff2;base64,${font}) format('woff2')}html,body{margin:0;background:transparent}svg{display:block}`;
  const shot = async (markup, size, file, transparent) => {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent(`<style>${css}svg{width:${size}px;height:${size}px}</style>${markup}`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(150);
    await p.screenshot({ path: file, omitBackground: !!transparent });
  };
  await shot(svg, 512, path.join(pub, 'icon-512.png'));
  await shot(svg, 192, path.join(pub, 'icon-192.png'));
  await shot(svg, 180, path.join(pub, 'apple-touch-icon.png'));
  await shot(svg, 48, path.join(pub, 'icon-48.png'));
  await shot(badge, 96, path.join(pub, 'badge-96.png'), true);
  if (preview) { // how it looks large, as a round launcher icon, and small
    await p.setViewportSize({ width: 1000, height: 420 });
    await p.setContent(`<style>${css}body{background:#888;display:flex;gap:40px;align-items:center;padding:30px}
      .a svg{width:360px;height:360px}.b svg{width:300px;height:300px;clip-path:circle(40%)}
      .c svg{width:96px;height:96px;border-radius:22px}.d svg{width:48px;height:48px;border-radius:10px}.e{background:#222;padding:12px}.e svg{width:72px;height:72px}</style>
      <div class="a">${svg}</div><div class="b">${svg}</div><div class="c">${svg}</div><div class="d">${svg}</div><div class="e">${badge}</div>`);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    await p.screenshot({ path: preview });
    console.log('furthest point of the drawing from the centre, as a share of the icon (maskable limit 0.40):', await p.evaluate(() => { const svg = document.querySelector('.a svg'); let far = 0; for (const el of svg.querySelectorAll('g, text')) { if (el.closest('clipPath')) continue; const r = el.getBoundingClientRect(), s = svg.getBoundingClientRect(), cx = s.left + s.width / 2, cy = s.top + s.height / 2; for (const [x, y] of [[r.left, r.top], [r.right, r.top], [r.left, r.bottom], [r.right, r.bottom]]) far = Math.max(far, Math.hypot(x - cx, y - cy) / s.width); } return far.toFixed(3) + ' (bounding boxes, so an over-estimate)'; }));
  }
  await b.close();
  console.log('rendered');
})();
