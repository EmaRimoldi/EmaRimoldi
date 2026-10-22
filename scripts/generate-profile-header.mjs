import { mkdir, writeFile } from 'node:fs/promises';

// Responsive name and role header for the GitHub profile README.
// The image is self-contained: no fonts, scripts, or external services to load.
const out = new URL('../assets/profile/', import.meta.url);
await mkdir(out, { recursive: true });
for (const mobile of [false, true]) {
  for (const dark of [false, true]) {
    const width = mobile ? 440 : 960, height = mobile ? 176 : 176;
    const ink = dark ? '#f0f1ed' : '#191d1b';
    const muted = dark ? '#a9b1ac' : '#58605b';
    const name = mobile
      ? '<text x="0" y="54" class="name">Emanuele</text><text x="0" y="101" class="name">Rimoldi</text>'
      : '<text x="0" y="79" class="name">Emanuele Rimoldi</text>';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">Emanuele Rimoldi — Researcher at MIT</title>
<desc id="desc">Emanuele Rimoldi, Researcher at MIT.</desc>
<style>
.name{font:400 ${mobile ? 42 : 57}px Arial,Helvetica,sans-serif;letter-spacing:-1.5px;fill:${ink}}
.role{font:400 ${mobile ? 19 : 24}px Arial,Helvetica,sans-serif;fill:${muted}}
</style>
${name}
<text x="1" y="${mobile ? 142 : 121}" class="role">Researcher at MIT</text>
</svg>\n`;
    const nameFile = `intro-${mobile ? 'mobile-' : ''}${dark ? 'dark' : 'light'}.svg`;
    await writeFile(new URL(nameFile, out), svg);
    console.log(nameFile, Buffer.byteLength(svg), 'bytes');
  }
}
