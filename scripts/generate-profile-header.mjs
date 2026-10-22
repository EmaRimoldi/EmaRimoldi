import { mkdir, writeFile } from 'node:fs/promises';

// ASCII interpretation of the iris motif on https://www.emanuelerimoldi.com/.
// The image is self-contained: no fonts, scripts, or external services to load.
const out = new URL('../assets/profile/', import.meta.url);
await mkdir(out, { recursive: true });
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
let seed = 586875;
const random = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
const cols = 70, rows = 35, stepX = 3.6, stepY = 7.2;
const glyphs = [];
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const x = (col + .5) * stepX, y = (row + .5) * stepY;
    const dx = x - 126, dy = y - 126;
    const radius = Math.hypot(dx, dy), angle = Math.atan2(dy, dx);
    if (radius < 35 || radius > 109) continue;
    const t = (radius - 35) / 74;
    const ray = .5 + .5 * Math.sin(angle * 83 + Math.sin(t * 17) * .65);
    const secondary = .5 + .5 * Math.cos(angle * 137 - t * 11);
    const rims = Math.exp(-(((radius - 38) / 4) ** 2)) + .65 * Math.exp(-(((radius - 104) / 4) ** 2));
    const intensity = Math.min(1, .2 + .4 * ray + .2 * secondary + .3 * rims + random() * .12);
    const ramp = '.:-=+*#%@';
    const char = ramp[Math.min(ramp.length - 1, Math.floor(intensity * (ramp.length - 1)))];
    glyphs.push({ x, y, char, opacity: (.55 + .42 * intensity).toFixed(2), band: row % 7 });
  }
}
const bands = Array.from({ length: 7 }, (_, band) =>
  `<g class="grain grain-${band}">${glyphs.filter(p => p.band === band).map(p =>
    `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" opacity="${p.opacity}">${escape(p.char)}</text>`
  ).join('')}</g>`
).join('');
for (const mobile of [false, true]) {
  for (const dark of [false, true]) {
    const width = mobile ? 440 : 960, height = mobile ? 176 : 176;
    const ink = dark ? '#f0f1ed' : '#191d1b';
    const muted = dark ? '#a9b1ac' : '#58605b';
    const eyeX = mobile ? 295 : 746, eyeY = mobile ? 5 : -10, scale = mobile ? .54 : .77;
    const name = mobile
      ? '<text x="0" y="54" class="name">Emanuele</text><text x="0" y="101" class="name">Rimoldi</text>'
      : '<text x="0" y="79" class="name">Emanuele Rimoldi</text>';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">Emanuele Rimoldi — Researcher at MIT</title>
<desc id="desc">A slowly moving iris made entirely of ASCII characters, echoing the personal website. Animation stops when reduced motion is preferred.</desc>
<style>
.name{font:400 ${mobile ? 42 : 57}px Arial,Helvetica,sans-serif;letter-spacing:-1.5px;fill:${ink}}
.role{font:400 ${mobile ? 19 : 24}px Arial,Helvetica,sans-serif;fill:${muted}}
.iris{fill:${ink};font:700 7.8px 'Courier New',monospace;transform-origin:126px 126px;animation:breathe 9s ease-in-out infinite}
.grain{animation:shimmer 6s ease-in-out infinite alternate}
${Array.from({ length: 7 }, (_, band) => `.grain-${band}{animation-delay:-${(band * .71).toFixed(2)}s}`).join('\n')}
@keyframes breathe{0%,100%{transform:rotate(-1.3deg) scale(.98)}50%{transform:rotate(1.3deg) scale(1.02)}}
@keyframes shimmer{from{opacity:.78}to{opacity:1}}
@media(prefers-reduced-motion:reduce){.iris,.grain{animation:none}}
</style>
${name}
<text x="1" y="${mobile ? 142 : 121}" class="role">Researcher at MIT</text>
<g transform="translate(${eyeX} ${eyeY}) scale(${scale})"><g class="iris">${bands}</g></g>
</svg>\n`;
    const nameFile = `intro-${mobile ? 'mobile-' : ''}${dark ? 'dark' : 'light'}.svg`;
    await writeFile(new URL(nameFile, out), svg);
    console.log(nameFile, Buffer.byteLength(svg), 'bytes');
  }
}
