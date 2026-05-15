// Build script — génère /docs avec assets optimisés et 11 signatures HTML inline.
// Usage : node build.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const BASE_URL = 'https://morganrxl.github.io/signatures';
const SRC_DIR = '/Users/morganrouxel/Desktop/sign';
const DOCS_DIR = path.join(__dirname, 'docs');
const ASSETS_DIR = path.join(DOCS_DIR, 'assets');
const SIG_DIR = path.join(DOCS_DIR, 'signatures');

// ----- BRANDS -----
const BRANDS = {
  TDN: {
    id: 'TDN', name: 'Tomber des Nues',
    site: 'tomberdesnues.com', siteUrl: 'https://www.tomberdesnues.com',
    linkedin: 'https://www.linkedin.com/company/tomber-des-nues',
    reviewUrl: 'https://g.page/r/CeobGah7TNL3EBM/review',
    reviewMsg: 'Vous aimez travailler avec nous — Partagez votre expérience',
    accent: '#C06D80', accentPale: '#F6C9D0',
    logoFile: 'logo-tdn.svg', logoWidth: 160, labels: true
  },
  KP: {
    id: 'KP', name: 'Karré Production',
    site: 'karreprod.com', siteUrl: 'https://www.karreprod.com',
    linkedin: 'https://www.linkedin.com/company/karreprod',
    reviewUrl: 'https://g.page/r/CVx3cb3BazfdEBM/review',
    reviewMsg: 'Vous aimez travailler avec nous — Partagez votre expérience',
    accent: '#EC6908', accentPale: '#FBD8B8',
    logoFile: 'logo_kp_fixed.svg', logoWidth: 135, labels: true
  },
  PS: {
    id: 'PS', name: 'Piano Service',
    site: 'pianoservice.fr', siteUrl: 'https://www.pianoservice.fr',
    linkedin: 'https://www.linkedin.com/company/piano-service',
    reviewUrl: 'https://g.page/r/CbqoLnVueb81EBM/review',
    reviewMsg: 'Vous aimez travailler avec nous — Partagez votre expérience',
    accent: '#E20E18', accentPale: '#F8C7CA',
    logoFile: 'LOGO-COMPLET-PS_fixed.svg', logoWidth: 210, labels: false
  }
};

// ----- MAPPING photo source -----
const PHOTO_MAP = {
  yann: '110', jacques: '64', clement: '70', florian: '89',
  anne: '49', veronique: '41',
  sonia: '19', eulalie: '28', sidonie: '59',
  alexandre: '74'
};

// ----- MEMBERS -----
const MEMBERS = [
  { id: 'yann',      brand: 'KP',  nom: 'Yann ROUXEL',      role: 'Directeur Général',                       email: 'yann@karreprod.com',        tel: '+33 6 27 42 78 20', photoId: 'yann' },
  { id: 'jacques',   brand: 'KP',  nom: 'Jacques KLOPOCKI', role: 'Directeur Associé',                       email: 'jacques@karreprod.com',     tel: '+33 6 24 18 51 44', photoId: 'jacques' },
  { id: 'clement',   brand: 'KP',  nom: 'Clément LE FUR',   role: 'Directeur Technique',                     email: 'clement@karreprod.com',     tel: '+33 6 78 56 38 68', photoId: 'clement' },
  { id: 'florian',   brand: 'KP',  nom: 'Florian LE FUR',   role: 'Directeur Technique',                     email: 'florian@karreprod.com',     tel: '+33 6 08 07 18 19', photoId: 'florian' },
  { id: 'anne',      brand: 'KP',  nom: 'Anne JOUANNE',     role: 'Directrice Administrative et Financière', email: 'anne@karreprod.com',        tel: '+33 6 62 21 60 61', photoId: 'anne' },
  { id: 'veronique', brand: 'KP',  nom: 'Véronique DURAND', role: 'Assistante de projet',                    email: 'veronique@karreprod.com',   tel: '+33 6 64 69 20 77', photoId: 'veronique' },
  { id: 'sonia',     brand: 'TDN', nom: 'Sonia ROUXEL',     role: 'Event Designer',                          email: 'sonia@tomberdesnues.com',   tel: '+33 6 03 43 07 76', photoId: 'sonia' },
  { id: 'eulalie',   brand: 'TDN', nom: 'Eulalie BEYSSEN',  role: 'Event Designer',                          email: 'eulalie@tomberdesnues.com', tel: '+33 6 15 08 27 31', photoId: 'eulalie' },
  { id: 'sidonie',   brand: 'TDN', nom: 'Sidonie BRASSART', role: 'Assistante de projet',                    email: 'sidonie@tomberdesnues.com', tel: '+33 7 83 73 95 96', photoId: 'sidonie' },
  { id: 'alexandre', brand: 'PS',  nom: 'Alexandre BILLON', role: 'Directeur Associé',                       email: 'alexandre@pianoservice.fr', tel: '+33 6 80 44 73 52', photoId: 'alexandre' },
  { id: 'yann-ps',   brand: 'PS',  nom: 'Yann ROUXEL',      role: 'Directeur Général',                       email: 'yann@pianoservice.fr',      tel: '+33 6 27 42 78 20', photoId: 'yann' }
];

// =========================================================================
// ASSETS BUILD
// =========================================================================

function ensureDirs() {
  [DOCS_DIR, ASSETS_DIR, SIG_DIR].forEach(d => fs.mkdirSync(d, { recursive: true }));
}

// Crop par personne : 'top' garde le haut (visages des portraits debout).
// Override possible si une photo a un cadrage particulier.
const CROP_POSITION = {
  yann: 'top', jacques: 'top', clement: 'top', florian: 'top',
  anne: 'top', veronique: 'top',
  sonia: 'top', eulalie: 'top', sidonie: 'top',
  alexandre: 'top'
};

async function buildPhotos() {
  for (const [id, num] of Object.entries(PHOTO_MAP)) {
    const src = path.join(SRC_DIR, `2025.12 Noe-l Karre-prod&Co-${num}.jpg`);
    const dst = path.join(ASSETS_DIR, `photo-${id}.jpg`);
    await sharp(src)
      .rotate()
      .resize(192, 192, { fit: 'cover', position: CROP_POSITION[id] || 'top' })
      .grayscale()
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(dst);
    console.log(`  photo-${id}.jpg OK`);
  }
}

// Convert SVG/img source to PNG @2x at given display width, return real display dims.
async function svgToPng(srcFile, dstFile, displayWidth) {
  const out = await sharp(path.join(SRC_DIR, srcFile), { density: 600 })
    .resize({ width: displayWidth * 2 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(ASSETS_DIR, dstFile));
  return { width: Math.round(out.width / 2), height: Math.round(out.height / 2) };
}

async function buildLogos() {
  const dims = {};
  dims.kp = await svgToPng(BRANDS.KP.logoFile, 'logo-kp.png', BRANDS.KP.logoWidth);
  dims.tdn = await svgToPng(BRANDS.TDN.logoFile, 'logo-tdn.png', BRANDS.TDN.logoWidth);
  dims.ps = await svgToPng(BRANDS.PS.logoFile, 'logo-ps.png', BRANDS.PS.logoWidth);
  console.log('  logos PNG OK', dims);
  return dims;
}

async function buildBadges() {
  const SIZE = 38;
  const dims = {};
  // EcoVadis (carré)
  await sharp(path.join(SRC_DIR, 'cert-ecovadis.svg'), { density: 600 })
    .resize({ height: SIZE * 2, width: SIZE * 2, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(ASSETS_DIR, 'cert-ecovadis.png'));
  dims.ecovadis = { w: SIZE, h: SIZE };

  // Label événement (JPG)
  const labelOut = await sharp(path.join(SRC_DIR, 'Logo-Label-e1499678404115.jpg'))
    .resize({ height: SIZE * 2 })
    .toFormat('png')
    .toFile(path.join(ASSETS_DIR, 'label-event.png'));
  dims.label = { w: Math.round(labelOut.width / 2), h: SIZE };

  // Synpase (PNG)
  const synOut = await sharp(path.join(SRC_DIR, 'logo-synpase.png'))
    .resize({ height: SIZE * 2 })
    .png()
    .toFile(path.join(ASSETS_DIR, 'logo-synpase.png'));
  dims.synpase = { w: Math.round(synOut.width / 2), h: SIZE };

  console.log('  badges PNG OK', dims);
  return dims;
}

// =========================================================================
// HTML GENERATION
// =========================================================================

function labelsStripHtml(badges, gap = 18) {
  const items = [
    { src: `${BASE_URL}/assets/cert-ecovadis.png`, w: badges.ecovadis.w, h: badges.ecovadis.h, alt: 'EcoVadis' },
    { src: `${BASE_URL}/assets/label-event.png`,    w: badges.label.w,    h: badges.label.h,    alt: 'Le Label' },
    { src: `${BASE_URL}/assets/logo-synpase.png`,   w: badges.synpase.w,  h: badges.synpase.h,  alt: 'Synpase' }
  ];
  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;"><tr>${items.map((it, i) => `<td valign="middle" style="padding:0 ${i === items.length - 1 ? 0 : gap}px 0 0;"><img src="${it.src}" width="${it.w}" height="${it.h}" alt="${it.alt}" style="display:block;border:0;width:${it.w}px;height:${it.h}px;" /></td>`).join('')}</tr></table>`;
}

function buildEditorial(m, brand, logoDims, badges) {
  const { accent, accentPale } = brand;
  const photoUrl = `${BASE_URL}/assets/photo-${m.photoId}.jpg`;
  const logoUrl = `${BASE_URL}/assets/logo-${brand.id.toLowerCase()}.png`;
  const logoH = logoDims.height;
  const logoW = logoDims.width;
  const firstName = m.nom.split(' ')[0];
  const lastName = m.nom.split(' ').slice(1).join(' ');
  const titleFamily = "'Avenir Next','Avenir',Helvetica,Arial,sans-serif";

  const photoBlock = `<td valign="top" style="padding:0 26px 0 0;width:108px;"><img src="${photoUrl}" width="96" height="96" alt="${m.nom}" style="display:block;border:0;width:96px;height:96px;border-radius:96px;" /></td>`;

  const labelsRow = brand.labels
    ? `<tr><td colspan="3" style="padding:14px 0;border-top:1px solid ${accentPale};border-bottom:1px solid ${accentPale};">${labelsStripHtml(badges)}</td></tr>`
    : `<tr><td colspan="3" style="padding:0;border-top:1px solid ${accentPale};">&nbsp;</td></tr>`;

  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;font-size:14px;line-height:1.45;">
  <tr>
    ${photoBlock}
    <td valign="top" style="padding:0 30px 0 0;border-right:1px solid ${accent};">
      <div style="font-family:${titleFamily};font-size:26px;line-height:1.1;color:#0a0a0a;font-weight:800;letter-spacing:0.01em;">${firstName} <span style="font-weight:300;color:#1a1a1a;">${lastName}</span></div>
      <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#4d4d4c;margin-top:10px;letter-spacing:0.22em;text-transform:uppercase;">${m.role}</div>
      <div style="height:18px;line-height:18px;font-size:0;">&nbsp;</div>
      <div style="font-size:13px;line-height:1.7;color:#1a1a1a;">
        <a href="mailto:${m.email}" style="color:#1a1a1a;text-decoration:none;border-bottom:1px solid ${accentPale};">${m.email}</a><br/>
        <a href="tel:${m.tel.replace(/\s/g,'')}" style="color:#1a1a1a;text-decoration:none;">${m.tel}</a><br/>
        <a href="${brand.siteUrl}" style="color:#1a1a1a;text-decoration:none;font-weight:600;">${brand.site}</a> · <a href="${brand.linkedin}" style="color:#1a1a1a;text-decoration:none;font-weight:600;">LinkedIn</a>
      </div>
    </td>
    <td valign="middle" align="center" style="padding:0 0 0 26px;width:${logoW + 10}px;text-align:center;">
      <img src="${logoUrl}" width="${logoW}" height="${logoH}" alt="${brand.name}" style="display:block;border:0;width:${logoW}px;height:${logoH}px;margin:0 auto;" />
    </td>
  </tr>
  <tr><td colspan="3" style="height:18px;line-height:18px;font-size:0;">&nbsp;</td></tr>
  ${labelsRow}
  <tr>
    <td colspan="3" style="padding:14px 0 0;">
      <span style="font-family:${titleFamily};font-weight:300;font-size:13px;color:#1a1a1a;letter-spacing:0.01em;">«&nbsp;${brand.reviewMsg}&nbsp;»</span>
      <a href="${brand.reviewUrl}" style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#1a1a1a;text-decoration:none;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;border-bottom:2px solid ${accentPale};padding-bottom:2px;margin-left:8px;">→ Laissez votre avis</a>
    </td>
  </tr>
</table>`;
}

function wrapStandalone(innerHtml, title) {
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:24px;background:#fff;font-family:Helvetica,Arial,sans-serif;">
${innerHtml}
</body></html>`;
}

// =========================================================================
// INDEX HTML — page de copie
// =========================================================================

function buildIndex() {
  const groups = ['KP', 'TDN', 'PS'].map(bid => {
    const b = BRANDS[bid];
    const items = MEMBERS.filter(m => m.brand === bid).map(m => `
      <li style="display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid #ece6e0;">
        <img src="assets/photo-${m.photoId}.jpg" width="48" height="48" style="border-radius:48px;display:block;" alt="">
        <div style="flex:1;">
          <div style="font-weight:600;font-size:15px;color:#1a1a1a;">${m.nom}</div>
          <div style="font-size:12px;color:#666;letter-spacing:0.06em;text-transform:uppercase;margin-top:2px;">${m.role}</div>
          <div style="font-size:12px;color:#999;margin-top:2px;">${m.email}</div>
        </div>
        <button data-id="${m.id}" data-name="${m.nom}" style="background:${b.accent};color:#fff;border:0;padding:10px 18px;border-radius:6px;font-weight:600;cursor:pointer;font-size:13px;letter-spacing:0.02em;">Copier la signature</button>
        <a href="signatures/${m.id}.html" target="_blank" style="font-size:12px;color:#999;text-decoration:none;border-bottom:1px dotted #ccc;">aperçu</a>
      </li>`).join('');
    return `
      <section style="margin:40px 0;">
        <h2 style="font-family:'Avenir Next','Avenir',Helvetica,sans-serif;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;color:${b.accent};margin:0 0 8px;">${b.name}</h2>
        <ul style="list-style:none;padding:0;margin:0;">${items}</ul>
      </section>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Signatures email — Karré Prod / Tomber des Nues / Piano Service</title>
<style>
  body{margin:0;padding:40px 24px;background:#fbf9f7;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;}
  .wrap{max-width:780px;margin:0 auto;background:#fff;padding:36px 40px;border-radius:14px;box-shadow:0 1px 3px rgba(0,0,0,0.04);}
  h1{font-family:'Avenir Next','Avenir',Helvetica,sans-serif;font-size:28px;margin:0 0 6px;letter-spacing:-0.01em;}
  .sub{color:#666;font-size:14px;margin-bottom:24px;line-height:1.55;}
  .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1a1a1a;color:#fff;padding:12px 20px;border-radius:8px;font-size:13px;opacity:0;transition:opacity .25s;pointer-events:none;}
  .toast.show{opacity:1;}
  ol.howto{font-size:13px;color:#444;line-height:1.7;background:#fbf6f0;padding:14px 20px 14px 36px;border-radius:8px;border-left:3px solid #EC6908;}
</style>
</head>
<body>
<div class="wrap">
  <h1>Signatures email</h1>
  <p class="sub">Choisis ta signature, clique <strong>Copier</strong>, puis colle dans Gmail / Outlook / Apple Mail.</p>
  <ol class="howto">
    <li>Clique <strong>Copier la signature</strong>.</li>
    <li>Ouvre les paramètres de signature de ton client mail.</li>
    <li>Colle (Cmd/Ctrl + V). Les images s'affichent automatiquement.</li>
  </ol>
  ${groups}
</div>
<div class="toast" id="toast">Signature copiée. Colle dans ton mail.</div>
<script>
const toast = document.getElementById('toast');
function showToast(msg){ toast.textContent = msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'), 2400); }
document.querySelectorAll('button[data-id]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const id = btn.dataset.id;
    try {
      const res = await fetch('signatures/' + id + '.html');
      const fullHtml = await res.text();
      const m = fullHtml.match(/<body[^>]*>([\\s\\S]*?)<\\/body>/i);
      const html = (m ? m[1] : fullHtml).trim();
      const text = html.replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').trim();
      const blobHtml = new Blob([html], { type: 'text/html' });
      const blobText = new Blob([text], { type: 'text/plain' });
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })]);
      } catch (err) {
        const div = document.createElement('div');
        div.contentEditable = true;
        div.style.cssText = 'position:fixed;left:-9999px;';
        div.innerHTML = html;
        document.body.appendChild(div);
        const range = document.createRange(); range.selectNodeContents(div);
        const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        document.execCommand('copy');
        document.body.removeChild(div);
      }
      showToast('Signature de ' + btn.dataset.name + ' copiée.');
    } catch (e) {
      showToast('Erreur : ' + e.message);
    }
  });
});
</script>
</body>
</html>`;
}

// =========================================================================
// MAIN
// =========================================================================

(async () => {
  console.log('1. Préparation des dossiers');
  ensureDirs();

  console.log('2. Photos (10) — crop carré 192x192 + grayscale');
  await buildPhotos();

  console.log('3. Logos marques');
  const logoDims = await buildLogos();

  console.log('4. Badges (EcoVadis + Label + Synpase)');
  const badges = await buildBadges();

  console.log('5. Génération des 11 signatures HTML');
  const dimsByBrand = { KP: logoDims.kp, TDN: logoDims.tdn, PS: logoDims.ps };
  for (const m of MEMBERS) {
    const brand = BRANDS[m.brand];
    const sig = buildEditorial(m, brand, dimsByBrand[m.brand], badges);
    const standalone = wrapStandalone(sig, `${m.nom} — ${brand.name}`);
    fs.writeFileSync(path.join(SIG_DIR, `${m.id}.html`), standalone);
    console.log(`  signatures/${m.id}.html`);
  }

  console.log('6. index.html + .nojekyll');
  fs.writeFileSync(path.join(DOCS_DIR, 'index.html'), buildIndex());
  fs.writeFileSync(path.join(DOCS_DIR, '.nojekyll'), '');

  console.log('Build terminé.');
})().catch(err => { console.error(err); process.exit(1); });
