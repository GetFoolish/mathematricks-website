const http = require('http');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node serve-single.js <file-path> <port>');
  process.exit(1);
}

const fileArg = args[0];
const port = parseInt(args[1], 10) || 2000;
const filePath = path.isAbsolute(fileArg) ? fileArg : path.join(__dirname, '..', fileArg);
if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

const dir = path.dirname(filePath);
const fileName = path.basename(filePath);

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/' + fileName;
  const safePath = path.normalize(path.join(dir, reqPath));
  if (!safePath.startsWith(dir)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(safePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    const ext = path.extname(safePath).toLowerCase();
    const mime = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'text/html';
    res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-store' });
    res.end(data);
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${fileName} at http://localhost:${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
  process.exit(1);
});
