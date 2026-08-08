# Larry Producer — Packs

Selector de packs (`index.html`) + los flujos de venta que se abren desde ahí. Cada `PACK *.html` es un archivo único y autocontenido (sin dependencias externas, todo embebido) que se muestra al artista con el detalle del servicio, fase por fase, y el precio con descuento.

## Archivos

- `index.html` — página principal: pestañas **Packs** (elegí cuál abrir) y **Casos de Éxito** (playlist de Spotify, videos en el estudio, bonus gratis).
- `PACK PRODUCCIÓN COMPLETA @larry.prod.html` — 300€
- `PACK PRODUCCIÓN DE EP @larry.prod.html` — 250€ / canción
- `PACK BEATMAKING @larry.prod.html` — 200€
- `PACK MIX & MASTER @larry.prod.html` — 150€
- `PACK MASTER POR STEMS @larry.prod.html` — 50€
- `PACK TOP GLOBAL @larry.prod Ft. Fede Ceballos (Barcelona).html` — 400€ (con estudio)
- `PACK TOP GLOBAL @larry.prod Ft. Jhonny 90s (Madrid).html` — 425€ (con estudio)

Todos los archivos tienen que quedar juntos en la misma carpeta — `index.html` enlaza a cada pack por su nombre de archivo.

## Ver en local

Abrí `index.html` con doble clic, o arrastralo a un navegador.

## Publicar con GitHub Pages

1. En este repo: **Settings → Pages**.
2. En "Build and deployment", elegí **Deploy from a branch**.
3. Branch: `main`, carpeta `/ (root)`.
4. Guardá — GitHub te da una URL tipo `https://<usuario>.github.io/<repo>/`.

Nota: como los nombres de archivo tienen espacios, acentos y `&`, las URLs se ven con `%20`, `%C3%93`, `%26`, etc. Funciona igual, solo que el link no es lindo — avisame si en algún momento querés que los renombre a algo tipo `pack-produccion-completa.html` para links más prolijos.
