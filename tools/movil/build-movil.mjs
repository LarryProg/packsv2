// Genera la versión vertical para celular de cada PACK *.html en ../../movil/
// Uso: node tools/movil/build-movil.mjs   (desde la carpeta larry-packs)
// No toca los packs originales: copia el archivo y le inyecta CSS + JS que
// desarma el lienzo horizontal y apila las fases una debajo de otra.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const out = join(root, 'movil');
mkdirSync(out, { recursive: true });

const CSS = `
<style id="movil-css">
html.m,html.m body{height:auto;min-height:100%;overflow-x:hidden;overflow-y:auto}
html.m #viewport,html.m #controls,html.m #hint{display:none!important}
html.m .brand-lockup{position:static;justify-content:center;padding:22px 0 4px}
html.m #brand-logo{height:34px}
#m-stars{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
#m-stars #stars{position:absolute!important;left:-200px!important;top:-200px!important}
#m-flow{position:relative;z-index:1;max-width:480px;margin:0 auto;padding:14px 16px 56px}
#m-flow .title-note,#m-flow .note,#m-flow .final-note,#m-flow .frame{
  position:static!important;left:auto!important;top:auto!important;width:auto!important;height:auto!important}
#m-flow .title-note{padding:22px 20px;margin-bottom:34px}
#m-flow .pack-badge{font-size:24px;padding:9px 18px}
#m-flow .title-note h1{font-size:20px;line-height:1.25}
#m-flow .title-note p{font-size:13.5px}
#m-flow .frame{padding:34px 12px 12px;display:flex;flex-direction:column;gap:12px;position:relative!important}
#m-flow .frame-label{top:-19px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:17px;padding:6px 18px;max-width:calc(100% - 16px);overflow:hidden;text-overflow:ellipsis}
#m-flow .note{padding:16px 18px}
#m-flow .note h4{font-size:16.5px}
#m-flow .note p,#m-flow .note li{font-size:14.5px}
#m-flow .note.photo-note{padding:0}
#m-flow .m-arrow{text-align:center;font-size:26px;font-weight:800;color:var(--red);margin:6px 0 26px;line-height:1}
#m-flow .final-note{padding:30px 20px 34px}
#m-flow .final-note .cuota{font-size:64px}
#m-foot{text-align:center;font-size:11px;color:var(--muted-2);margin-top:22px;letter-spacing:.3px}
#m-foot a{color:var(--muted);text-decoration:none}
</style>
`;

const JS = `
<script id="movil-js">
(function(){
  var html = document.documentElement;
  html.classList.add('m');
  var board = document.getElementById('board');
  if (!board) return;
  function px(el, prop){ var v = parseFloat(el.style[prop]); return isNaN(v) ? 0 : v; }

  // Fondo de estrellas fijo
  var bg = document.createElement('div'); bg.id = 'm-stars';
  var stars = document.getElementById('stars');
  if (stars) bg.appendChild(stars);
  document.body.insertBefore(bg, document.body.firstChild);

  var flow = document.createElement('div'); flow.id = 'm-flow';
  var title = board.querySelector('.title-note');
  if (title) flow.appendChild(title);

  // Cada nota va a la fase (frame) cuyo rango horizontal la contiene
  var frames = Array.prototype.slice.call(board.querySelectorAll('.frame'))
    .sort(function(a,b){ return px(a,'left') - px(b,'left'); });
  var notes = Array.prototype.slice.call(board.querySelectorAll('.note'));
  frames.forEach(function(fr, i){
    var l = px(fr,'left'), r = l + px(fr,'width');
    notes.filter(function(n){ var x = px(n,'left'); return x >= l - 5 && x <= r; })
      .sort(function(a,b){ return px(a,'top') - px(b,'top'); })
      .forEach(function(n){ fr.appendChild(n); });
    flow.appendChild(fr);
    var arrow = document.createElement('div'); arrow.className = 'm-arrow'; arrow.textContent = '↓';
    flow.appendChild(arrow);
  });

  var fin = board.querySelector('.final-note');
  if (fin) flow.appendChild(fin);

  var foot = document.createElement('div'); foot.id = 'm-foot';
  foot.innerHTML = '<a href="https://www.instagram.com/larry.prod/" target="_blank" rel="noopener">@larry.prod</a>';
  flow.appendChild(foot);

  var vp = document.getElementById('viewport');
  vp.parentNode.insertBefore(flow, vp);
})();
</script>
`;

const files = readdirSync(root).filter(f => /^PACK .*\.html$/.test(f));
for (const f of files) {
  let src = readFileSync(join(root, f), 'utf8');
  src = src.replace(/<!-- VERSION:[^>]*-->/, m => m + '\n<!-- MOVIL: generado por tools/movil/build-movil.mjs, no editar a mano -->');
  src = src.replace('</head>', CSS + '</head>');
  const i = src.lastIndexOf('</body>');
  src = src.slice(0, i) + JS + src.slice(i);
  writeFileSync(join(out, f), src);
  console.log('ok', f);
}
console.log(files.length, 'packs →', out);
