// Genera "MAPA ESTUDIOS @larry.prod.html" en larry-packs (autocontenido).
import fs from 'fs';
import { createRequire } from 'module';
import { geoConicConformal, geoMercator, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
const require = createRequire(import.meta.url);
const OUT = 'C:/Users/loren/Downloads/ARREGLAR/larry-packs/MAPA ESTUDIOS @larry.prod.html';
const INDEX = 'C:/Users/loren/Downloads/ARREGLAR/larry-packs/index.html';

const es = require('es-atlas/es/autonomous_regions.json');
const world = require('world-atlas/countries-50m.json');
const regions = feature(es, es.objects.autonomous_regions).features;
const W = 1000, H = 760;

const isCan = f => /Canarias/.test(f.properties.name);
const isCM = f => /Ceuta|Melilla/.test(f.properties.name);
const main = regions.filter(f => !isCan(f));
const can = regions.filter(isCan);

const proj = geoConicConformal().parallels([36, 43]).rotate([3.5, 0])
  .fitExtent([[40, 30], [W - 30, H - 40]], { type: 'FeatureCollection', features: main.filter(f => !isCM(f)) });
// Recuadro de Canarias abajo a la derecha (mar libre)
const box = { x: 640, y: 585, w: 330, h: 150 };
const projC = geoMercator().fitExtent([[box.x + 14, box.y + 14], [box.x + box.w - 14, box.y + box.h - 14]], { type: 'FeatureCollection', features: can });
const path = geoPath(proj), pathC = geoPath(projC);
const r = n => Math.round(n * 10) / 10;
const clean = d => (d || '').replace(/\d+\.\d+/g, m => String(r(+m)));

const regionPaths = [
  ...main.map(f => ({ n: f.properties.name, d: clean(path(f)) })),
  ...can.map(f => ({ n: f.properties.name, d: clean(pathC(f)) })),
];
const neigh = feature(world, world.objects.countries).features
  .filter(f => /^(Portugal|France|Morocco|Andorra|Algeria)$/.test(f.properties.name))
  .map(f => clean(path(f)));

const P = 'PACK TOP GLOBAL @larry.prod Ft. ';
const studios = [
  { id: 'fede', name: 'Fede Ceballos', city: 'Barcelona', sub: 'Centro, Barcelona', ll: [2.17, 41.39], price: 400, pack: P + 'Fede Ceballos (Barcelona).html' },
  { id: 'jhonny', name: 'Jhonny 90s', city: 'Madrid', sub: 'Arganda del Rey, Madrid', ll: [-3.44, 40.30], price: 425, pack: P + 'Jhonny 90s (Madrid).html' },
  { id: 'yisus', name: 'Yisus', city: 'Zaragoza', sub: 'También cubre Málaga, Granada y Cádiz', ll: [-0.88, 41.65], price: 400, pack: P + 'Yisus (Zaragoza).html',
    zones: [['Málaga', -4.42, 36.72], ['Granada', -3.60, 37.18], ['Cádiz', -6.29, 36.53]] },
  { id: 'david', name: 'David', city: 'Elche', sub: 'The Lost Productions · Alicante', ll: [-0.70, 38.27], price: 400, pack: P + 'David (Elche).html' },
  { id: 'danilo', name: 'Danilo', city: 'Islas Canarias', sub: 'Gran Canaria', ll: [-15.43, 28.10], price: 400, pack: P + 'Danilo (Islas Canarias).html', canarias: true },
  { id: 'llorlellas', name: 'Llorlellas', city: 'Galicia', sub: 'Galicia', ll: [-8.20, 42.80], price: 400, pack: P + 'Llorlellas (Galicia).html' },
  { id: 'skullboy', name: 'Javi Skullboy', city: 'Valencia', sub: 'Valencia', ll: [-0.38, 39.47], price: 400, pack: P + 'Javi Skullboy (Valencia).html' },
  { id: 'javichu', name: 'Javichu', city: 'Lorca', sub: 'Lorca, Murcia', ll: [-1.70, 37.68], price: 400, pack: P + 'Javichu (Lorca).html' },
  { id: 'jotage', name: 'Jotage', city: 'Toledo', sub: 'Toledo', ll: [-4.03, 39.86], price: 425, pack: P + 'Jotage (Toledo).html' },
  { id: 'charly', name: 'Charly', city: 'Málaga', sub: 'Málaga', ll: [-4.42, 36.72], price: 400, pack: P + 'Charly (Málaga).html' },
  { id: 'cray', name: 'Cray Ldr', city: 'Sevilla', sub: 'Sevilla', ll: [-5.98, 37.39], price: 400, pack: P + 'Cray Ldr (Sevilla).html' },
];
for (const s of studios) {
  const [x, y] = (s.canarias ? projC : proj)(s.ll);
  s.x = r(x); s.y = r(y);
  if (s.zones) s.zones = s.zones.map(([n, lo, la]) => { const [zx, zy] = proj([lo, la]); return { n, x: r(zx), y: r(zy) }; });
}
const [hx, hy] = proj([2.65, 39.57]); // Larry, Palma de Mallorca
const home = { x: r(hx), y: r(hy) };

const logo = (fs.readFileSync(INDEX, 'utf8').match(/<img id="main-logo" src="([^"]+)"/) || [])[1] || '';
const tpl = fs.readFileSync(new URL('./mapa-template.html', import.meta.url), 'utf8');
const html = tpl
  .replace('__LOGO__', logo)
  .replace('__DATA__', JSON.stringify({ W, H, box, home, regions: regionPaths, neigh, studios }));
fs.writeFileSync(OUT, html);
console.log('ok', (html.length / 1024).toFixed(0) + ' KB', studios.map(s => `${s.id}:${s.x},${s.y}`).join(' '), 'home', home);
