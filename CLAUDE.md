# plumcut.com

Static marketing site. Plain HTML, no framework, no bundler. Deployed on Vercel
from `main`; every push goes live. `cleanUrls: true`, so `/blog/foo.html` serves
at `/blog/foo`.

## Layout

```
index.html  how-it-works.html  solutions.html  pricing.html  about.html  privacy.html
assets/main.css        pre-compiled Tailwind, ~30k lines, NOT live JIT
assets/main.js         site behaviour (GSAP reveals, sticky nav, loader)
vendor/                pinned third-party JS
images/                site art, .webp preferred
blog/                  GENERATED. Do not hand-edit any .html in here.
blog/posts/*.md        the only hand-written blog source
scripts/build-blog.js  the generator
scripts/templates/page.html   the page shell, extracted verbatim from privacy.html
markdown/              the Readiness Workbook, the positioning source of truth
```

## The one CSS rule that bites

`assets/main.css` is **pre-compiled and static**. Any Tailwind utility class
that was not already used in the original template does not exist in the CSS and
silently renders as nothing. The worst version of this is on dark backgrounds:
`text-white/85` does not exist, so the text falls back to the dark default and
becomes invisible.

Text colour classes that DO exist: `text-white`, `text-white/60`,
`text-secondary`, `text-secondary/40`, `text-secondary/60`, `text-secondary/80`.

Before relying on a class, check it: `grep -E '\.classname \{' assets/main.css`.
Otherwise use inline `style="..."` or a scoped `<style>` block. Brand colours:
orange `#E65E04`, plum `#481D52`, deep plum `#4B1D6A`.

`main.css` also ships `main h2 { text-transform: uppercase; text-align: center }`
with `!important`. Article prose has to outrank that, which is why the blog CSS
carries `!important` on its heading rules.

## House rules for copy

- **No em dashes or en dashes anywhere.** Commas, full stops, or restructure.
- **plumcut and plum are always lowercase.** Never "AI agent" or "AI system".
- **WhatsApp only in public copy.** Never Instagram.
- Lead with selling, not support.
- Never ship a fabricated statistic, case study or testimonial.
- Any page with `FAQPage` JSON-LD must have a matching visible FAQ. The blog
  builder enforces this; on hand-written pages it is on you.

## The blog

### Building

```bash
node scripts/build-blog.js          # build everything
node scripts/build-blog.js --check  # validate and report, write nothing
```

Zero dependencies. No `npm install` step, ever.

Reads `blog/posts/*.md` (files starting with `_` are ignored) and writes:

- `blog/<slug>.html` for each post
- `blog/index.html`, the hub
- `blog/rss.xml`
- `sitemap.xml`, regenerated whole
- the `<!-- BLOG:LATEST:START -->` block in `index.html`

It deletes and rewrites every `blog/*.html` on each run, so **the generated HTML
is disposable**. Fix problems in the `.md` source or in the builder, never in
the output.

Front matter is documented in `blog/posts/_TEMPLATE.md`. The parser is a small
YAML subset, so stay inside the shapes shown there.

The build warns (does not fail) on: thin posts under 500 words, meta
descriptions over 165 characters, a missing hero image, and em dashes it had to
replace. Read the warnings before committing.

### Changing the design

`scripts/templates/page.html` is the site shell with `{{TOKENS}}` punched into
it. It was generated from `privacy.html`, so it carries the real nav, footer,
loader, fonts and script tags. Article-specific CSS lives in the `BLOG_CSS`
constant in `scripts/build-blog.js`.

Change either one and rerun the build; every post is re-rendered at once. That
is the entire reason posts are markdown and not hand-written HTML.

If the site's shared chrome changes (nav, footer, a new script tag), regenerate
the template from the updated `privacy.html` rather than patching it by hand.

### Where the blog is linked from

Deliberately **not in the top navigation**. Five items is already tight on
mobile. It is reachable from:

- the footer `Menu` column on all six pages
- the "Latest from plumcut" strip on the home page
- `sitemap.xml`, `llms.txt`, `robots.txt`, `blog/rss.xml`

That is enough for crawlers and for AI search without cluttering the nav. Do not
add a Blog item to `.pc-nav`.

### The publishing pipeline

Content lives in Notion, under **plumcut - HQ / Brand & Identity / Branding /
cowork - Blog**, in the `Blog` database. That page is the operating manual for
both scheduled runs; read it before touching this pipeline.

```
writer run (every 2 days)      research a question, write it, Status = drafted
you, in Notion                 read it, edit it, Status = approved
publisher run (3x a week)      approved row  ->  .md  ->  build  ->  push  ->  Status = published
```

Nothing reaches the site without a human flipping a row to `approved`.

## Previewing locally

`assets/main.css` hides every `[data-ns-animate]` element at `opacity: 0` until
GSAP ScrollTrigger reveals it, and that often does not fire in headless Chrome.
A blank-looking screenshot is usually this, not a layout bug. To see the real
layout, render a temp copy with this injected before `</head>`:

```html
<style>[data-ns-animate]{opacity:1!important;filter:none!important;transform:none!important}</style>
```

The blog templates use root-absolute asset paths (`/images/...`), which do not
resolve over `file://`. Rewrite them to `../images/...` in the temp copy too, or
serve the directory over HTTP.

Also give Chrome `--virtual-time-budget=8000` or more so the `body.is-loading`
preloader clears.
