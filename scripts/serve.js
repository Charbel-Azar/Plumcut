#!/usr/bin/env node
/**
 * Local preview server that mimics the Vercel config.
 *
 * Live Server and most static servers do not implement `cleanUrls`, so
 * /blog/some-post 404s locally even though it works in production. This server
 * resolves the same way Vercel does, so what you see locally is what ships.
 *
 *   node scripts/serve.js          http://localhost:5500
 *   node scripts/serve.js 4000     a different port
 *
 * Zero dependencies, same as the blog builder.
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = Number(process.argv[2]) || 5500;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.jfif': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json',
  '.pdf': 'application/pdf',
};

const isFile = (p) => {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
};

/** Resolve a request path the way Vercel does with cleanUrls: true. */
function resolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  // block traversal outside the project
  const rel = path.normalize(decoded).replace(/^([/\\])+/, '');
  const base = path.join(ROOT, rel);
  if (!base.startsWith(ROOT)) return null;

  if (decoded.endsWith('/')) {
    const idx = path.join(base, 'index.html');
    return isFile(idx) ? idx : null;
  }
  if (isFile(base)) return base;
  // cleanUrls: /blog/post -> blog/post.html
  if (isFile(base + '.html')) return base + '.html';
  // directory without the trailing slash: /blog -> blog/index.html
  const idx = path.join(base, 'index.html');
  if (isFile(idx)) return idx;
  return null;
}

http
  .createServer((req, res) => {
    const file = resolve(req.url === '/' ? '/index.html' : req.url);

    if (!file) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(
        `<pre style="font:14px/1.6 monospace;padding:2rem">404  ${req.url}\n\n` +
          `Nothing resolved for that path. On this server /blog/some-post maps to\n` +
          `blog/some-post.html, exactly like Vercel's cleanUrls.\n\n` +
          `Did you run: node scripts/build-blog.js</pre>`
      );
      return;
    }

    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => {
    console.log(`plumcut preview  http://localhost:${PORT}`);
    console.log(`             blog http://localhost:${PORT}/blog/`);
    console.log('cleanUrls is emulated, so extensionless post URLs work. Ctrl+C to stop.');
  });
