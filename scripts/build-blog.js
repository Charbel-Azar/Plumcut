#!/usr/bin/env node
/**
 * plumcut blog builder
 *
 * Reads every post in blog/posts/*.md, renders each one into the site shell
 * (scripts/templates/page.html, extracted verbatim from privacy.html so the
 * chrome can never drift), then regenerates the hub, the RSS feed, the
 * sitemap and the homepage "Latest" strip.
 *
 * Zero dependencies on purpose: the scheduled cowork agent runs `node
 * scripts/build-blog.js` with no npm install step.
 *
 *   node scripts/build-blog.js           build everything
 *   node scripts/build-blog.js --check   build to memory and report, write nothing
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'blog', 'posts');
const OUT_DIR = path.join(ROOT, 'blog');
const TEMPLATE = path.join(__dirname, 'templates', 'page.html');
const SITE = 'https://plumcut.com';
const OG_FALLBACK = SITE + '/images/shared/plumcut-og-image.jpg';
const WA = 'https://wa.me/96181864662?text=Hi%20plum!';

const DRY = process.argv.includes('--check');

/* ---------------------------------------------------------------- helpers */

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// House rule: no em/en dashes anywhere in published copy. Normalise rather
// than fail the build, and report so the writer agent learns.
const DASH_RE = /[—–]/g;

const fmtDate = (iso) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/* ------------------------------------------------------- front matter (subset YAML)
 * Supports: key: value | key: [a, b] | key: <list of - items>
 *           faq: <list of "- q: ... / a: ..." maps>
 */
function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('missing --- front matter block');

  const data = {};
  const lines = m[1].split(/\r?\n/);
  let i = 0;

  const unquote = (v) => {
    v = v.trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      return v.slice(1, -1);
    }
    return v;
  };

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) {
      i++;
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) {
      i++;
      continue;
    }
    const key = kv[1];
    const inline = kv[2].trim();

    if (inline) {
      if (inline.startsWith('[') && inline.endsWith(']')) {
        data[key] = inline
          .slice(1, -1)
          .split(',')
          .map((s) => unquote(s))
          .filter(Boolean);
      } else {
        data[key] = unquote(inline);
      }
      i++;
      continue;
    }

    // block: either a list of scalars or a list of maps
    const items = [];
    i++;
    while (i < lines.length && /^\s+/.test(lines[i])) {
      const item = lines[i];
      const bullet = item.match(/^\s+-\s*(.*)$/);
      if (bullet) {
        const first = bullet[1];
        const map = first.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
        if (map) {
          const obj = { [map[1]]: unquote(map[2]) };
          i++;
          while (i < lines.length && /^\s+/.test(lines[i]) && !/^\s+-/.test(lines[i])) {
            const sub = lines[i].match(/^\s+([A-Za-z0-9_]+):\s*(.*)$/);
            if (sub) obj[sub[1]] = unquote(sub[2]);
            i++;
          }
          items.push(obj);
          continue;
        }
        items.push(unquote(first));
      }
      i++;
    }
    data[key] = items;
  }

  return { data, body: m[2] };
}

/* ----------------------------------------------------------- markdown subset
 * Deliberately small and predictable: headings, paragraphs, lists, tables,
 * blockquotes, code, hr, links, images, bold/italic, inline code.
 */
function inline(s) {
  let out = esc(s);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(
    /!\[([^\]]*)\]\(([^)\s]+)\)/g,
    (_, alt, src) => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">`
  );
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, href) => {
    const ext = /^https?:\/\//.test(href) && !href.includes('plumcut.com');
    return `<a href="${esc(href)}" class="blog-link"${
      ext ? ' target="_blank" rel="noopener nofollow"' : ''
    }>${text}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  return out;
}

function markdown(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let i = 0;
  const headings = [];

  const flushParagraph = (buf) => {
    if (buf.length) out.push(`<p>${inline(buf.join(' '))}</p>`);
    buf.length = 0;
  };

  const para = [];

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      flushParagraph(para);
      i++;
      continue;
    }

    // fenced code
    if (/^```/.test(line)) {
      flushParagraph(para);
      const code = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i++;
      out.push(`<pre class="blog-code"><code>${esc(code.join('\n'))}</code></pre>`);
      continue;
    }

    // heading
    const h = line.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      flushParagraph(para);
      const level = h[1].length;
      const text = h[2].trim();
      const id = slugify(text);
      if (level === 2) headings.push({ id, text });
      out.push(`<h${level} id="${id}" class="blog-h${level}">${inline(text)}</h${level}>`);
      i++;
      continue;
    }

    // hr
    if (/^(---|\*\*\*)\s*$/.test(line)) {
      flushParagraph(para);
      out.push('<hr class="blog-hr">');
      i++;
      continue;
    }

    // blockquote (used for the citable answer block)
    if (/^>\s?/.test(line)) {
      flushParagraph(para);
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(`<blockquote class="blog-quote">${markdown(buf.join('\n')).html}</blockquote>`);
      continue;
    }

    // table
    if (/^\|/.test(line) && /^\|[\s:|-]+\|$/.test(lines[i + 1] || '')) {
      flushParagraph(para);
      const cells = (r) =>
        r
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => c.trim());
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(cells(lines[i++]));
      out.push(
        '<div class="blog-table-wrap"><table class="blog-table"><thead><tr>' +
          head.map((c) => `<th>${inline(c)}</th>`).join('') +
          '</tr></thead><tbody>' +
          rows
            .map((r) => '<tr>' + r.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>')
            .join('') +
          '</tbody></table></div>'
      );
      continue;
    }

    // lists
    const isUl = /^\s*[-*]\s+/.test(line);
    const isOl = /^\s*\d+\.\s+/.test(line);
    if (isUl || isOl) {
      flushParagraph(para);
      const tag = isUl ? 'ul' : 'ol';
      const re = isUl ? /^\s*[-*]\s+/ : /^\s*\d+\.\s+/;
      const items = [];
      while (i < lines.length && re.test(lines[i])) {
        let text = lines[i].replace(re, '');
        i++;
        // continuation lines
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !re.test(lines[i])) {
          text += ' ' + lines[i].trim();
          i++;
        }
        items.push(`<li>${inline(text)}</li>`);
      }
      out.push(`<${tag} class="blog-list">${items.join('')}</${tag}>`);
      continue;
    }

    para.push(line.trim());
    i++;
  }
  flushParagraph(para);

  return { html: out.join('\n'), headings };
}

/* ------------------------------------------------------------------ pieces */

function faqBlock(faq) {
  if (!faq || !faq.length) return '';
  return `
<section class="blog-faq" aria-labelledby="blog-faq-title">
  <h2 id="blog-faq-title" class="blog-h2">Questions people also ask</h2>
  ${faq
    .map(
      (f) => `<details class="blog-faq-item">
    <summary>${esc(f.q)}</summary>
    <div class="blog-faq-answer">${markdown(f.a).html}</div>
  </details>`
    )
    .join('\n  ')}
</section>`;
}

function ctaBlock(post) {
  const line =
    post.ctaLine ||
    'plum answers, sells, books and tracks orders on WhatsApp, in Arabic and English, and hands you back what your customers keep asking for.';
  return `
<aside class="blog-cta" aria-label="Talk to plum">
  <p class="blog-cta-kicker">plumcut can do this for you</p>
  <p class="blog-cta-body">${inline(line)}</p>
  <a class="blog-cta-button" href="${WA}" target="_blank" rel="noopener">Talk to plum on WhatsApp</a>
  <p class="blog-cta-links">
    See <a href="/solutions.html">what plum handles</a>,
    <a href="/how-it-works.html">how we build it</a>, or
    <a href="/pricing.html">what it costs</a>.
  </p>
</aside>`;
}

function tocBlock(headings) {
  if (headings.length < 3) return '';
  return `
<nav class="blog-toc" aria-label="On this page">
  <p class="blog-toc-title">On this page</p>
  <ol>
    ${headings.map((h) => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join('\n    ')}
  </ol>
</nav>`;
}

function relatedBlock(post, all) {
  let picks = [];
  if (post.related && post.related.length) {
    picks = post.related.map((s) => all.find((p) => p.slug === s)).filter(Boolean);
  }
  if (picks.length < 3) {
    for (const p of all) {
      if (p.slug === post.slug || picks.includes(p)) continue;
      picks.push(p);
      if (picks.length >= 3) break;
    }
  }
  picks = picks.slice(0, 3);
  if (!picks.length) return '';
  return `
<section class="blog-related" aria-labelledby="blog-related-title">
  <h2 id="blog-related-title" class="blog-h2">Keep reading</h2>
  <div class="blog-related-grid">
    ${picks.map((p) => card(p)).join('\n    ')}
  </div>
</section>`;
}

function card(p) {
  return `<a class="blog-card" href="/blog/${p.slug}">
      <div class="blog-card-media">
        <img src="${esc(p.hero || OG_FALLBACK)}" alt="${esc(p.heroAlt || '')}" loading="lazy" decoding="async">
      </div>
      <div class="blog-card-body">
        <span class="blog-card-tag">${esc(TYPE_LABEL[p.type] || 'Guide')}</span>
        <h3 class="blog-card-title">${esc(p.title)}</h3>
        <p class="blog-card-desc">${esc(p.description)}</p>
        <span class="blog-card-date">${fmtDate(p.date)}</span>
      </div>
    </a>`;
}

const TYPE_LABEL = {
  general: 'Automation guide',
  comparison: 'Comparison',
  direct: 'plum in practice',
};

/* --------------------------------------------------------------- page CSS */

const BLOG_CSS = `    <style>
      /* ---- blog: scoped, no invented Tailwind utilities (main.css is pre-compiled) ---- */
      .blog-shell { max-width: 780px; margin: 0 auto; }
      .blog-wide { max-width: 1180px; margin: 0 auto; }
      .blog-hero-media { border-radius: 24px; overflow: hidden; margin-bottom: 2.5rem; background: #f2ecf4; }
      .blog-hero-media img { width: 100%; height: clamp(220px, 38vw, 460px); object-fit: cover; display: block; }
      .blog-hero-credit { font-size: 0.78rem; color: #481D52; opacity: 0.55; margin-top: 0.6rem; text-align: right; }
      .blog-hero-credit a { text-decoration: underline; }
      .blog-meta { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; align-items: center; color: #481D52; opacity: 0.7; font-size: 0.9rem; margin-bottom: 1.25rem; }
      .blog-tag { background: #E65E04; color: #fff; border-radius: 999px; padding: 0.22rem 0.8rem; font-size: 0.78rem; letter-spacing: 0.02em; opacity: 1; }
      .blog-body { color: #481D52; font-size: clamp(1rem, 1.05vw, 1.12rem); line-height: 1.75; }
      /* main.css ships a "main h2" rule forcing uppercase + centred with
         !important. That suits the section titles but not article prose.
         These selectors outrank it, so they need !important too. */
      main .blog-article h2, main .blog-article h3, main .blog-article h4,
      main .blog-index h2, main .blog-index h3 {
        text-align: left !important;
        text-transform: none !important;
        font-family: 'Alan Sans', sans-serif !important;
        font-weight: 500 !important;
      }
      main .blog-article .blog-h2, main .blog-index .blog-h2 {
        font-size: clamp(1.45rem, 2.2vw, 1.95rem) !important;
        line-height: 1.28 !important;
      }
      main .blog-article .blog-h3 { font-size: clamp(1.15rem, 1.6vw, 1.35rem) !important; line-height: 1.35 !important; }
      .blog-h2 { font-size: clamp(1.45rem, 2.2vw, 1.95rem); font-weight: 500; color: #481D52; margin: 2.6rem 0 0.9rem; line-height: 1.28; }
      .blog-h3 { font-size: clamp(1.15rem, 1.6vw, 1.35rem); font-weight: 500; color: #481D52; margin: 1.9rem 0 0.6rem; }
      .blog-h4 { font-size: 1.05rem; font-weight: 500; color: #481D52; margin: 1.4rem 0 0.4rem; }
      .blog-body p { margin: 0 0 1.15rem; }
      .blog-list { margin: 0 0 1.3rem 1.15rem; }
      .blog-list li { margin-bottom: 0.55rem; list-style: disc; }
      ol.blog-list li { list-style: decimal; }
      .blog-link { color: #E65E04; text-decoration: underline; text-underline-offset: 3px; }
      .blog-link:hover { opacity: 0.75; }
      .blog-quote { border-left: 3px solid #E65E04; background: #faf6fb; border-radius: 0 14px 14px 0; padding: 1.15rem 1.35rem; margin: 1.6rem 0; }
      .blog-quote p:last-child { margin-bottom: 0; }
      .blog-hr { border: 0; border-top: 1px solid rgba(72,29,82,0.15); margin: 2.4rem 0; }
      .blog-code { background: #2b0c3c; color: #f6efe9; border-radius: 14px; padding: 1rem 1.2rem; overflow-x: auto; font-size: 0.88rem; margin: 0 0 1.4rem; }
      .blog-table-wrap { overflow-x: auto; margin: 0 0 1.6rem; border-radius: 16px; border: 1px solid rgba(72,29,82,0.14); }
      .blog-table { width: 100%; border-collapse: collapse; font-size: 0.94rem; min-width: 520px; }
      .blog-table th { background: #481D52; color: #fff; text-align: left; padding: 0.8rem 1rem; font-weight: 500; }
      .blog-table td { padding: 0.8rem 1rem; border-top: 1px solid rgba(72,29,82,0.12); color: #481D52; vertical-align: top; }
      .blog-toc { background: #faf6fb; border: 1px solid rgba(72,29,82,0.12); border-radius: 18px; padding: 1.2rem 1.4rem; margin: 0 0 2.2rem; }
      .blog-toc-title { font-size: 0.8rem; letter-spacing: 0.09em; text-transform: uppercase; color: #E65E04; margin-bottom: 0.65rem; }
      .blog-toc ol { margin: 0; padding-left: 1.1rem; }
      .blog-toc li { list-style: decimal; margin-bottom: 0.35rem; color: #481D52; }
      .blog-toc a:hover { color: #E65E04; }
      .blog-faq { margin-top: 3rem; }
      .blog-faq-item { border-bottom: 1px solid rgba(72,29,82,0.14); padding: 0.35rem 0; }
      .blog-faq-item summary { cursor: pointer; list-style: none; padding: 0.95rem 2rem 0.95rem 0; color: #481D52; font-size: 1.02rem; position: relative; }
      .blog-faq-item summary::-webkit-details-marker { display: none; }
      .blog-faq-item summary::after { content: "+"; position: absolute; right: 0.2rem; top: 50%; transform: translateY(-50%); color: #E65E04; font-size: 1.35rem; line-height: 1; }
      .blog-faq-item[open] summary::after { content: "\\2013"; }
      .blog-faq-answer { padding: 0 0 1.1rem; color: #481D52; opacity: 0.85; }
      .blog-faq-answer p:last-child { margin-bottom: 0; }
      .blog-cta { background: #481D52; border-radius: 26px; padding: clamp(1.6rem, 3vw, 2.4rem); margin: 3rem 0 0; }
      .blog-cta-kicker { color: #E65E04; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.7rem; }
      .blog-cta-body { color: #fff; font-size: clamp(1.05rem, 1.5vw, 1.25rem); line-height: 1.6; margin-bottom: 1.5rem; }
      .blog-cta-button { display: inline-flex; align-items: center; justify-content: center; background: #E65E04; color: #fff; border-radius: 999px; padding: 0.85rem 1.9rem; font-size: 1.02rem; transition: transform .2s ease, opacity .2s ease; }
      .blog-cta-button:hover { transform: translateY(-2px); opacity: 0.92; }
      .blog-cta-links { color: #fff; opacity: 0.72; font-size: 0.9rem; margin-top: 1.2rem; }
      .blog-cta-links a { color: #fff; text-decoration: underline; text-underline-offset: 3px; }
      .blog-related { margin-top: 3.5rem; }
      .blog-related-grid, .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.6rem; }
      .blog-card { display: flex; flex-direction: column; border-radius: 22px; overflow: hidden; background: #fff; border: 1px solid rgba(72,29,82,0.12); transition: transform .25s ease, box-shadow .25s ease; }
      .blog-card:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(72,29,82,0.13); }
      .blog-card-media { background: #f2ecf4; }
      .blog-card-media img { width: 100%; height: 190px; object-fit: cover; display: block; }
      .blog-card-body { padding: 1.15rem 1.3rem 1.45rem; display: flex; flex-direction: column; gap: 0.55rem; flex: 1; }
      .blog-card-tag { color: #E65E04; font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; }
      .blog-card-title { color: #481D52; font-size: 1.1rem; font-weight: 500; line-height: 1.35; }
      .blog-card-desc { color: #481D52; opacity: 0.72; font-size: 0.92rem; line-height: 1.55; flex: 1; }
      .blog-card-date { color: #481D52; opacity: 0.5; font-size: 0.8rem; }
      .blog-empty { color: #481D52; opacity: 0.7; padding: 2rem 0; }
      @media (max-width: 640px) {
        .blog-hero-media img { height: 210px; }
        .blog-cta { border-radius: 20px; }
      }
    </style>`;

/* -------------------------------------------------------------- rendering */

function render(tpl, vars) {
  return tpl.replace(/\{\{([A-Z]+)\}\}/g, (m, k) =>
    Object.prototype.hasOwnProperty.call(vars, k) ? vars[k] : m
  );
}

function articleJsonLd(post) {
  const blocks = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      image: post.hero || OG_FALLBACK,
      datePublished: post.date,
      dateModified: post.updated || post.date,
      inLanguage: 'en',
      author: { '@type': 'Organization', name: 'plumcut', url: SITE + '/' },
      publisher: {
        '@type': 'Organization',
        name: 'plumcut',
        url: SITE + '/',
        logo: { '@type': 'ImageObject', url: SITE + '/images/shared/new%20icon.png' },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${post.slug}` },
      isPartOf: { '@type': 'Blog', '@id': `${SITE}/blog/`, name: 'plumcut blog' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE + '/blog/' },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE}/blog/${post.slug}` },
      ],
    },
  ];

  // Only emit FAQPage when a matching visible FAQ is actually rendered.
  if (post.faq && post.faq.length) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  return blocks
    .map((b) => `<script type="application/ld+json">\n${JSON.stringify(b, null, 2)}\n</script>`)
    .join('\n');
}

function renderPost(post, all, tpl) {
  const { html, headings } = markdown(post.body);

  const hero = post.hero
    ? `<figure class="blog-hero-media">
        <img src="${esc(post.hero)}" alt="${esc(post.heroAlt || post.title)}" width="1600" height="900" fetchpriority="high" decoding="async">
      </figure>${
        post.heroCredit
          ? `\n      <p class="blog-hero-credit">Photo by <a href="${esc(
              post.heroCreditUrl || '#'
            )}" target="_blank" rel="noopener nofollow">${esc(post.heroCredit)}</a> on Unsplash</p>`
          : ''
      }`
    : '';

  const main = `      <article class="blog-article lg:py-[100px] pt-16 md:pt-20 lg:pb-[140px] md:pb-[100px] pb-16 mt-10 md:mt-16 lg:mt-20">
        <div class="main-container edge-safe max-w-[1880px]">
          <div class="blog-shell">

            <div class="space-y-3 mb-8">
              <p data-ns-animate data-delay="0.1" class="section-title-label sm:justify-start justify-center">
                <img class="section-title-bullet" src="/images/index/Bullet-Orange.svg" alt="" aria-hidden="true" />
                <a class="section-title-text" href="/blog/">Blog</a>
              </p>
              <h1 data-ns-animate data-delay="0.2" style="color: #481D52;" class="text-heading-4">
                ${esc(post.title)}
              </h1>
              <div data-ns-animate data-delay="0.25" class="blog-meta">
                <span class="blog-tag">${esc(TYPE_LABEL[post.type] || 'Guide')}</span>
                <time datetime="${esc(post.date)}">${fmtDate(post.date)}</time>
                <span>${post.readingTime} min read</span>
              </div>
            </div>

            ${hero}

            ${tocBlock(headings)}

            <div class="blog-body">
${html}
            </div>

            ${faqBlock(post.faq)}

            ${ctaBlock(post)}

            ${relatedBlock(post, all)}

          </div>
        </div>
      </article>`;

  return render(tpl, {
    TITLE: esc(post.title + ' | plumcut'),
    DESC: esc(post.description),
    KEYWORDS: esc((post.keywords || []).join(', ')),
    URL: `${SITE}/blog/${post.slug}`,
    OGTYPE: 'article',
    IMAGE: esc(post.hero || OG_FALLBACK),
    IMAGETYPE: /\.png(\?|$)/i.test(post.hero || '') ? 'image/png' : 'image/jpeg',
    IMAGEALT: esc(post.heroAlt || post.title),
    JSONLD: articleJsonLd(post),
    PAGECSS: BLOG_CSS,
    MAIN: main,
  });
}

function renderHub(all, tpl) {
  const cards = all.length
    ? all.map((p) => card(p)).join('\n      ')
    : '<p class="blog-empty">The first posts are on their way.</p>';

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      '@id': SITE + '/blog/',
      name: 'plumcut blog',
      description:
        'Practical guides on WhatsApp automation, AI customer conversations and customer insight for commerce brands in MENA and beyond.',
      url: SITE + '/blog/',
      inLanguage: 'en',
      publisher: { '@type': 'Organization', name: 'plumcut', url: SITE + '/' },
      blogPost: all.map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        description: p.description,
        datePublished: p.date,
        url: `${SITE}/blog/${p.slug}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE + '/blog/' },
      ],
    },
  ]
    .map((b) => `<script type="application/ld+json">\n${JSON.stringify(b, null, 2)}\n</script>`)
    .join('\n');

  const main = `      <section class="blog-index lg:py-[100px] pt-16 md:pt-20 lg:pb-[140px] md:pb-[100px] pb-16 mt-10 md:mt-16 lg:mt-20">
        <div class="main-container edge-safe max-w-[1880px]">
          <div class="blog-wide">

            <div class="space-y-3 mb-10 md:mb-14">
              <h1 data-ns-animate data-delay="0.1" class="section-title-label sm:justify-start justify-center">
                <img class="section-title-bullet" src="/images/index/Bullet-Orange.svg" alt="" aria-hidden="true" />
                <span class="section-title-text">Blog</span>
              </h1>
              <p data-ns-animate data-delay="0.2" style="color: #481D52;" class="text-heading-4 max-w-[820px]">
                How brands actually automate WhatsApp, and what they learn about their customers when they do.
              </p>
              <p data-ns-animate data-delay="0.3" style="color: #481D52; opacity: 0.7;" class="text-tagline-1 max-w-[720px]">
                Written by the team building plum. No theory we have not shipped.
              </p>
            </div>

            <div class="blog-grid" data-ns-animate data-delay="0.4">
      ${cards}
            </div>

          </div>
        </div>
      </section>`;

  return render(tpl, {
    TITLE: 'Blog | plumcut',
    DESC: esc(
      'Practical guides on WhatsApp automation, AI that sells, and turning customer conversations into insight you own. From the team building plum.'
    ),
    KEYWORDS: 'WhatsApp automation, AI chatbot, customer insight, ecommerce automation, MENA',
    URL: SITE + '/blog/',
    OGTYPE: 'website',
    IMAGE: OG_FALLBACK,
    IMAGETYPE: 'image/jpeg',
    IMAGEALT: 'plumcut, the AI that sells on WhatsApp',
    JSONLD: jsonld,
    PAGECSS: BLOG_CSS,
    MAIN: main,
  });
}

function renderRss(all) {
  const items = all
    .slice(0, 30)
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>
      <description>${esc(p.description)}</description>
      <pubDate>${new Date(p.date + 'T09:00:00Z').toUTCString()}</pubDate>
    </item>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>plumcut blog</title>
    <link>${SITE}/blog/</link>
    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Practical guides on WhatsApp automation, AI that sells, and customer insight you own.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

function renderSitemap(all) {
  const today = new Date().toISOString().slice(0, 10);
  const core = [
    ['/', '2026-06-17'],
    ['/how-it-works.html', '2026-06-17'],
    ['/solutions.html', '2026-06-17'],
    ['/pricing.html', '2026-06-17'],
    ['/about.html', '2026-06-17'],
    ['/privacy.html', '2026-09-04'],
    ['/blog/', all.length ? all[0].date : today],
  ];
  const urls = core
    .map(([loc, mod]) => `  <url>\n    <loc>${SITE}${loc}</loc>\n    <lastmod>${mod}</lastmod>\n  </url>`)
    .concat(
      all.map(
        (p) =>
          `  <url>\n    <loc>${SITE}/blog/${p.slug}</loc>\n    <lastmod>${
            p.updated || p.date
          }</lastmod>\n  </url>`
      )
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/* -------------------------------------------------- homepage "Latest" strip */

function updateHomeLatest(all) {
  const file = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const START = '<!-- BLOG:LATEST:START -->';
  const END = '<!-- BLOG:LATEST:END -->';
  if (!html.includes(START)) return false;

  const picks = all.slice(0, 3);
  // index.html does not carry BLOG_CSS, so the strip ships the card rules it needs.
  const stripCss = `<style>
  .home-latest .blog-wide { max-width: 1180px; margin: 0 auto; }
  .home-latest .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.6rem; }
  .home-latest .blog-card { display: flex; flex-direction: column; border-radius: 22px; overflow: hidden; background: #fff; border: 1px solid rgba(72,29,82,0.12); transition: transform .25s ease, box-shadow .25s ease; }
  .home-latest .blog-card:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(72,29,82,0.13); }
  .home-latest .blog-card-media { background: #f2ecf4; }
  .home-latest .blog-card-media img { width: 100%; height: 190px; object-fit: cover; display: block; }
  .home-latest .blog-card-body { padding: 1.15rem 1.3rem 1.45rem; display: flex; flex-direction: column; gap: 0.55rem; flex: 1; }
  .home-latest .blog-card-tag { color: #E65E04; font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; }
  .home-latest .blog-card-title { color: #481D52; font-size: 1.1rem; font-weight: 500; line-height: 1.35; }
  .home-latest .blog-card-desc { color: #481D52; opacity: 0.72; font-size: 0.92rem; line-height: 1.55; flex: 1; }
  .home-latest .blog-card-date { color: #481D52; opacity: 0.5; font-size: 0.8rem; }
  .home-latest .blog-link { color: #E65E04; text-decoration: underline; text-underline-offset: 3px; }
  main .home-latest h2, main .home-latest h3 { text-align: left !important; text-transform: none !important; font-weight: 500 !important; }
  main .home-latest .blog-card-title { font-size: 1.1rem !important; line-height: 1.35 !important; }
</style>`;
  const inner = picks.length
    ? `
${stripCss}
<section class="home-latest lg:py-[90px] py-14" aria-labelledby="home-latest-title">
  <div class="main-container edge-safe max-w-[1880px]">
    <div class="blog-wide">
      <div class="space-y-3 mb-8 md:mb-12">
        <p data-ns-animate data-delay="0.1" class="section-title-label sm:justify-start justify-center">
          <img class="section-title-bullet" src="images/index/Bullet-Orange.svg" alt="" aria-hidden="true" />
          <span class="section-title-text">Blog</span>
        </p>
        <h2 id="home-latest-title" data-ns-animate data-delay="0.2" style="color: #481D52;" class="text-heading-4 max-w-[820px]">
          Latest from plumcut
        </h2>
      </div>
      <div class="blog-grid" data-ns-animate data-delay="0.3">
        ${picks.map((p) => card(p)).join('\n        ')}
      </div>
      <p class="mt-8" style="color:#481D52;">
        <a href="blog/" class="blog-link">Read everything on the plumcut blog</a>
      </p>
    </div>
  </div>
</section>`
    : '';

  const next = html.replace(
    new RegExp(START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    START + inner + '\n' + END
  );
  if (next === html) return false;
  if (!DRY) fs.writeFileSync(file, next);
  return true;
}

/* ------------------------------------------------ llms.txt blog listing */

function updateLlmsTxt(all) {
  const file = path.join(ROOT, 'llms.txt');
  if (!fs.existsSync(file)) return false;
  let txt = fs.readFileSync(file, 'utf8');
  const START = '<!-- BLOG:LIST:START -->';
  const END = '<!-- BLOG:LIST:END -->';
  if (!txt.includes(START)) return false;

  const lines = all
    .slice(0, 25)
    .map((p) => `- [${p.title}](${SITE}/blog/${p.slug}): ${p.description}`)
    .join('\n');

  const next = txt.replace(
    new RegExp(
      START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
        '[\\s\\S]*?' +
        END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    ),
    START + (lines ? '\n' + lines : '') + '\n' + END
  );
  if (next === txt) return false;
  if (!DRY) fs.writeFileSync(file, next);
  return true;
}

/* -------------------------------------------------------------------- main */

function main() {
  const tpl = fs.readFileSync(TEMPLATE, 'utf8');

  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'));

  const warnings = [];
  const posts = [];

  for (const f of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8');
    let parsed;
    try {
      parsed = parseFrontMatter(raw);
    } catch (e) {
      throw new Error(`${f}: ${e.message}`);
    }
    const d = parsed.data;

    for (const req of ['title', 'description', 'date']) {
      if (!d[req]) throw new Error(`${f}: front matter is missing "${req}"`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date)) {
      throw new Error(`${f}: date must be YYYY-MM-DD, got "${d.date}"`);
    }

    let body = parsed.body;
    const dashes = (body.match(DASH_RE) || []).length + (String(d.title).match(DASH_RE) || []).length;
    if (dashes) {
      warnings.push(`${f}: replaced ${dashes} em/en dash(es) (house rule: none)`);
      body = body.replace(DASH_RE, ',');
      d.title = String(d.title).replace(DASH_RE, ',');
      d.description = String(d.description).replace(DASH_RE, ',');
    }

    const words = body.split(/\s+/).filter(Boolean).length;

    posts.push({
      file: f,
      slug: d.slug || slugify(d.title),
      title: d.title,
      description: d.description,
      date: d.date,
      updated: d.updated || null,
      type: d.type || 'general',
      keywords: d.keywords || [],
      hero: d.hero || '',
      heroAlt: d.heroAlt || '',
      heroCredit: d.heroCredit || '',
      heroCreditUrl: d.heroCreditUrl || '',
      faq: d.faq || [],
      related: d.related || [],
      ctaLine: d.ctaLine || '',
      notionUrl: d.notionUrl || '',
      readingTime: Math.max(1, Math.round(words / 220)),
      words,
      body,
    });
  }

  // newest first
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug < b.slug ? 1 : -1));

  const seen = new Set();
  for (const p of posts) {
    if (seen.has(p.slug)) throw new Error(`duplicate slug "${p.slug}" (${p.file})`);
    seen.add(p.slug);
    if (p.words < 500) warnings.push(`${p.file}: only ${p.words} words, thin for ranking`);
    if (p.description.length > 165)
      warnings.push(`${p.file}: description is ${p.description.length} chars, over 165`);
    if (!p.hero) warnings.push(`${p.file}: no hero image`);
  }

  if (!DRY) {
    for (const f of fs.readdirSync(OUT_DIR)) {
      if (f.endsWith('.html')) fs.unlinkSync(path.join(OUT_DIR, f));
    }
  }

  for (const p of posts) {
    const out = path.join(OUT_DIR, p.slug + '.html');
    if (!DRY) fs.writeFileSync(out, renderPost(p, posts, tpl));
  }

  if (!DRY) {
    fs.writeFileSync(path.join(OUT_DIR, 'index.html'), renderHub(posts, tpl));
    fs.writeFileSync(path.join(OUT_DIR, 'rss.xml'), renderRss(posts));
    fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), renderSitemap(posts));
  }
  const homeTouched = updateHomeLatest(posts);
  const llmsTouched = updateLlmsTxt(posts);

  console.log(`${DRY ? '[check] ' : ''}built ${posts.length} post(s)`);
  for (const p of posts) console.log(`  /blog/${p.slug}  (${p.words}w, ${p.readingTime}min)`);
  console.log(
    `  /blog/  hub + rss.xml + sitemap.xml${homeTouched ? ' + homepage strip' : ''}${
      llmsTouched ? ' + llms.txt' : ''
    }`
  );
  if (warnings.length) {
    console.log('\nwarnings:');
    for (const w of warnings) console.log('  ! ' + w);
  }
}

main();
