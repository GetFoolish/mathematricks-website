const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const srcHtmlPath = path.join(projectRoot, 'index.html');
const outDir = path.join(projectRoot, 'design-previews');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let original;
try {
  original = fs.readFileSync(srcHtmlPath, 'utf8');
} catch (e) {
  console.error('Cannot read index.html at', srcHtmlPath);
  process.exit(1);
}

const themes = JSON.parse(fs.readFileSync(path.join(__dirname, 'themes.json'), 'utf8'));

function pick(arr, i) { return arr[i % arr.length]; }

function injectTheme(html, cssVars) {
  if (html.includes('</head>')) {
    return html.replace('</head>', `<style id="preview-theme">\n${cssVars}\n</style>\n</head>`);
  }
  return `<style id="preview-theme">\n${cssVars}\n</style>\n` + html;
}

for (let i = 0; i < 20; i++) {
  const palette = pick(themes.palettes, i);
  const font = pick(themes.fonts, i + 1);
  const layout = pick(themes.layouts, i + 2);

  const cssVars = `:root{--preview-bg: ${palette.bg}; --preview-primary: ${palette.primary}; --preview-accent: ${palette.accent}; --preview-text: ${palette.text}; --preview-font: ${font.css};}
html,body{ background:var(--preview-bg) !important; color:var(--preview-text) !important; font-family:var(--preview-font) !important; }
a, .btn{ color:var(--preview-primary) !important; }
.accent, .badge{ background:var(--preview-accent) !important; color: #000 !important; }
/* small helpers */
body{padding:24px}
`;

  const layoutScript = `<script>document.documentElement.setAttribute('data-preview-layout','${layout}');</script>`;

  const themed = injectTheme(original, cssVars) + '\n' + layoutScript;
  const outFile = path.join(outDir, `design-${String(i+1).padStart(2,'0')}.html`);
  fs.writeFileSync(outFile, themed, 'utf8');
}

console.log('Generated 20 previews in', outDir);
