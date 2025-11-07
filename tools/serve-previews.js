const http = require('http');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const previewsDir = path.join(projectRoot, 'design-previews');

const ports = process.argv.slice(2).map(p => parseInt(p, 10)).filter(Boolean);
if (ports.length === 0) {
  // default ports: 2000,2001,2002
  ports.push(2000, 2001, 2002);
}

if (!fs.existsSync(previewsDir)) {
  console.error('design-previews directory not found. Run tools/generate-previews.js first.');
  process.exit(1);
}

function createServerForFile(port, filePath) {
  const server = http.createServer((req, res) => {
    // only serve index and static files from same folder
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    const safePath = path.normalize(path.join(path.dirname(filePath), reqPath));
    if (!safePath.startsWith(path.dirname(filePath))) {
      res.writeHead(403);
      return res.end('Forbidden');
    }
    fs.readFile(safePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end('Not found');
      }
      const ext = path.extname(safePath).toLowerCase();
      const mime = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'text/html';
      res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-store' });
      res.end(data);
    });
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`Serving ${path.basename(filePath)} at http://localhost:${port}`);
  });
  server.on('error', (err) => {
    console.error(`Server error on port ${port}:`, err.message);
  });
}

ports.forEach((port, i) => {
  const idx = i; // choose design files sequentially
  const designFile = path.join(previewsDir, `design-${String(idx+1).padStart(2,'0')}.html`);
  if (!fs.existsSync(designFile)) {
    console.error(`Design file not found: ${designFile}. Run generator.`);
    return;
  }
  createServerForFile(port, designFile);
});

console.log('Started servers for ports:', ports.join(', '));
