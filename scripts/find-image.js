#!/usr/bin/env node
/**
 * Hero image finder for the blog.
 *
 *   node scripts/find-image.js "whatsapp shop owner phone counter"
 *   node scripts/find-image.js --source openverse "market stall lebanon"
 *   node scripts/find-image.js --json "packing table small business"
 *
 * Searches licensed sources in the order set by blog/ART-DIRECTION.md and
 * prints candidates with front matter ready to paste into a post.
 *
 * Sources:
 *   unsplash   needs UNSPLASH_ACCESS_KEY   (free: unsplash.com/developers)
 *   pexels     needs PEXELS_API_KEY        (free: pexels.com/api)
 *   openverse  no key, always available, quality is uneven
 *
 * Cosmos is deliberately NOT a source. Its images are third-party copyrighted
 * work saved as references, its terms grant no reuse rights, and its
 * robots.txt disallows /api/ for every crawler. Use it to decide the look,
 * then match that look here. See blog/ART-DIRECTION.md.
 *
 * Zero dependencies, same as the rest of the pipeline.
 */

'use strict';

const https = require('https');

const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');
const sourceFlag = args.indexOf('--source');
const ONLY = sourceFlag !== -1 ? args[sourceFlag + 1] : null;
const sourceValueIdx = sourceFlag === -1 ? -1 : sourceFlag + 1;
const query = args
  .filter((a, i) => !a.startsWith('--') && i !== sourceValueIdx)
  .join(' ')
  .trim();

if (!query) {
  console.error('usage: node scripts/find-image.js [--source unsplash|pexels|openverse] [--json] "search terms"');
  process.exit(1);
}

/** Words that signal the stock-photo clichés ART-DIRECTION.md bans. */
const BANNED = [
  'handshake', 'robot', 'android', 'cyborg', 'humanoid', 'circuit', 'binary',
  'hologram', 'holographic', 'futuristic', 'artificial intelligence concept',
  'brain', 'neural', 'blockchain', 'crypto', 'thumbs up', 'businesspeople',
  'business people', 'isolated on white', 'ai generated', 'ai-generated',
  'generated with ai', 'rendering', '3d render',
];

const get = (url, headers = {}) =>
  new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'plumcut-blog/1.0', ...headers } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          return resolve(get(res.headers.location, headers));
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`));
          }
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error('bad JSON from ' + url));
          }
        });
      })
      .on('error', reject);
  });

const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();

function banned(text) {
  const t = clean(text).toLowerCase();
  return BANNED.find((w) => t.includes(w)) || null;
}

/* ------------------------------------------------------------- sources */

async function unsplash(q) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return { skipped: 'no UNSPLASH_ACCESS_KEY set' };
  const url =
    'https://api.unsplash.com/search/photos?per_page=12&orientation=landscape&content_filter=high&query=' +
    encodeURIComponent(q);
  const data = await get(url, { Authorization: 'Client-ID ' + key });
  return {
    results: (data.results || []).map((p) => ({
      source: 'unsplash',
      hero: p.urls.raw + '&q=80&fm=jpg&crop=entropy&cs=srgb&w=1600',
      alt: clean(p.alt_description || p.description),
      credit: clean(p.user.name),
      creditUrl: p.user.links.html,
      license: 'Unsplash License, attribution required by their terms',
      text: [p.alt_description, p.description, (p.tags || []).map((t) => t.title).join(' ')].join(' '),
      w: p.width,
      h: p.height,
    })),
  };
}

async function pexels(q) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return { skipped: 'no PEXELS_API_KEY set' };
  const url =
    'https://api.pexels.com/v1/search?per_page=12&orientation=landscape&query=' +
    encodeURIComponent(q);
  const data = await get(url, { Authorization: key });
  return {
    results: (data.photos || []).map((p) => ({
      source: 'pexels',
      hero: p.src.landscape,
      alt: clean(p.alt),
      credit: clean(p.photographer),
      creditUrl: p.photographer_url,
      license: 'Pexels License, attribution appreciated',
      text: p.alt,
      w: p.width,
      h: p.height,
    })),
  };
}

async function openverse(q) {
  // Only CC0, public domain mark, and plain BY. Deliberately excludes ND
  // (the hero is cropped, which is a derivative) and SA (share-alike is a
  // bad fit for a commercial site).
  const url =
    'https://api.openverse.org/v1/images/?page_size=20&license=cc0,pdm,by&aspect_ratio=wide&q=' +
    encodeURIComponent(q);
  const data = await get(url);
  return {
    results: (data.results || []).map((p) => ({
      source: 'openverse/' + p.provider,
      hero: p.url,
      alt: clean(p.title),
      credit: clean(p.creator),
      creditUrl: p.creator_url || p.foreign_landing_url,
      license: `${String(p.license).toUpperCase()} ${p.license_version || ''}`.trim(),
      licenseUrl: p.license_url,
      text: [p.title, (p.tags || []).map((t) => t.name).join(' ')].join(' '),
      w: p.width,
      h: p.height,
    })),
  };
}

const SOURCES = { unsplash, pexels, openverse };

/* ---------------------------------------------------------------- main */

(async () => {
  const order = ONLY ? [ONLY] : ['unsplash', 'pexels', 'openverse'];
  const kept = [];
  const notes = [];

  for (const name of order) {
    const fn = SOURCES[name];
    if (!fn) {
      notes.push(`${name}: unknown source`);
      continue;
    }
    let out;
    try {
      out = await fn(query);
    } catch (e) {
      notes.push(`${name}: ${e.message}`);
      continue;
    }
    if (out.skipped) {
      notes.push(`${name}: skipped, ${out.skipped}`);
      continue;
    }
    for (const r of out.results) {
      const bad = banned(r.text);
      if (bad) continue;
      if (r.w && r.h && r.w / r.h < 1.2) continue; // will not survive the wide crop
      kept.push(r);
    }
    if (kept.length >= 6) break; // earlier sources are preferred, stop once we have enough
  }

  if (JSON_OUT) {
    console.log(JSON.stringify({ query, notes, candidates: kept }, null, 2));
    return;
  }

  console.log(`\nquery: ${query}`);
  for (const n of notes) console.log(`  note: ${n}`);
  if (!kept.length) {
    console.log('\nNo candidates. Try broader terms, or set UNSPLASH_ACCESS_KEY for much better results.');
    return;
  }

  console.log(`\n${kept.length} candidate(s), best first. Open each and check it survives a wide crop.\n`);
  kept.slice(0, 8).forEach((r, i) => {
    console.log(`--- ${i + 1}. ${r.source}  (${r.license})`);
    console.log(`hero: ${r.hero}`);
    console.log(`heroAlt: ${r.alt || '<< write a real description, do not leave this blank >>'}`);
    console.log(`heroCredit: ${r.credit}`);
    console.log(`heroCreditUrl: ${r.creditUrl}`);
    console.log('');
  });
  console.log('Paste the block you want into the post front matter.');
  console.log('Rules the finder cannot check for you are in blog/ART-DIRECTION.md.');
})();
