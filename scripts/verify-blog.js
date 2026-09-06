#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const SITE = 'https://plumcut.com';
const marker = html => html.match(/<meta name="plumcut-content-version" content="([a-f0-9]{64})">/)?.[1];

function verifyContent(slug, expected, actual, sitemap) {
  const expectedMarker = marker(expected);
  if (!expectedMarker) throw new Error('Local article has no version marker; run the blog build first.');
  if (marker(actual) !== expectedMarker) throw new Error('The served article is stale or does not match this build.');
  const canonical = `${SITE}/blog/${slug}`;
  if (!actual.includes(`rel="canonical" href="${canonical}"`)) throw new Error('Canonical URL does not match.');
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) throw new Error('Article is missing from the served sitemap.');
}

async function verify(slug, base = SITE) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '') || slug === 'index')
    throw new Error('Usage: node scripts/verify-blog.js <slug> [http://localhost:5500]');
  const origin = new URL(base);
  if (!['http:', 'https:'].includes(origin.protocol) || origin.pathname !== '/' || origin.search || origin.hash)
    throw new Error('Base URL must be an HTTP(S) origin.');
  const expected = fs.readFileSync(path.join(__dirname, '..', 'blog', slug + '.html'), 'utf8');
  const fetchText = async route => {
    const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(15000), cache: 'no-store' });
    if (response.status !== 200) throw new Error(`${route}: HTTP ${response.status}`);
    if (new URL(response.url).origin !== origin.origin) throw new Error(`${route}: redirected to a different origin`);
    return response.text();
  };
  const [actual, sitemap] = await Promise.all([fetchText(`/blog/${slug}`), fetchText('/sitemap.xml')]);
  verifyContent(slug, expected, actual, sitemap);
  console.log(`Verified ${origin.origin}/blog/${slug}: current article, canonical and sitemap.`);
}

if (require.main === module) {
  verify(process.argv[2], process.argv[3]).catch(error => {
    console.error(`Deployment unverified: ${error.message}`);
    process.exitCode = 1;
  });
}
module.exports = { verifyContent };
