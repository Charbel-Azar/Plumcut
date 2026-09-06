# Task: blog publisher

**Run by:** `plumcut blog, publisher`, Mon / Wed / Fri / Sat at 10:00 UTC.
**Job:** publish at most one approved post and verify it reached production.
**Source:** Notion `collection://0f269a5b-550b-4e9e-b34d-f4c4837be033`.
**Branch:** main, deployed by Vercel. Never force push or approve your own draft.

Read CLAUDE.md, blog/tasks/editorial.md and blog/posts/_TEMPLATE.md first. Use
available Git, web and Notion tools; do not assume a particular agent's tool names.
The scheduler must serialize publisher runs so two runs cannot claim the same row.

## 1. Synchronize and select

Start in a clean checkout of main, fetch origin and fast-forward only. On detached
HEAD, use a dedicated clean branch based on origin/main. Do not reset or overwrite
other work. If unable to synchronize safely, stop and report it.

Query Status = approved, oldest Created first. Status is a Notion **select**,
not status. No rows means nothing approved, a normal successful exit. Choose one,
read its properties and full body, and recheck approval before committing.
For a manually specified slug, select only that approved row.

## 2. Check for a retry

After synchronizing, look for blog/posts/*-<slug>.md. If it exists, verify that
its notionUrl identifies this row and its content matches the approved version.
Do not create a duplicate. Build and continue to production verification. File
existence or a Git commit alone does not mean publication succeeded. If the slug
belongs to another row or approved copy differs, report the conflict.

## 3. Convert approved content

Create blog/posts/YYYY-MM-DD-<slug>.md with today's initial publication date.
Copy title, slug, description, type, keywords, hero, heroAlt, heroCredit,
heroCreditUrl, heroSource, heroLicense, heroLicenseUrl and notionUrl from the row.
Keywords must be a YAML list. Omit empty optional fields.

Read the fenced JSON under `## Publishing metadata` before the article separator.
Carry related, ctaLine, author, authorUrl, reviewedBy and reviewerUrl into front
matter. Existing rows without this block remain supported using builder defaults.
Do not invent names or treat automated review as a named human review.
For an explicitly approved refresh, preserve slug, original date and source file;
set updated to the actual material revision date. Never refresh dates alone.

Strip metadata/review notes, hero, photo credit, callouts and leading separator
from the public body. Content before ## FAQ is the article. Convert each FAQ pair
to faq front matter, preserving wording. Convert Notion tables to Markdown.

Notion can rewrite relative links into app.notion.com URLs. Restore only known
destinations to /solutions, /how-it-works, /pricing or an existing /blog/<slug>;
do not guess ambiguous links. Strip Markdown links from plain-text credit/name
fields. Use clean internal URLs without .html.

## 4. Review and validate

Check the review record and follow editorial.md. If approved material contains
substantive factual problems, leave it approved, flag the correction, and stop
for editorial review. Do not silently publish rewritten claims.

Run `node scripts/build-blog.js --check`, then `node scripts/build-blog.js`.
Both render and validate pages; check mode writes nothing. Fix conversion errors,
broken internal links, invalid metadata or FAQ mismatches before proceeding.
Read warnings; short complete answers are acceptable without padding. Check that
related posts and the CTA fit this article and no private review notes leaked.

## 5. Commit and push

Vercel runs the builder using vercel.json. Commit the Markdown source. Generated
outputs already tracked in Git must be kept consistent and committed; do not start
tracking new generated article HTML unnecessarily. Inspect the staged diff and
include no unrelated files. Name the article in the commit message.

Push normally to main. If rejected, fetch and rebase only this run's own commit
onto origin/main in the clean task checkout, then rebuild and revalidate. Resolve
only mechanical conflicts; stop on an editorial conflict. Retry once, never force
push. Confirm the commit is on remote main (it may have newer descendants).

## 6. Verify production

Run `node scripts/verify-blog.js <slug>` against production. This checks HTTP 200,
the canonical URL, the generated content-version marker against the local build,
and the sitemap entry. A stale 200 page is not sufficient.

If deployment is pending, retry with brief intervals for up to two minutes.
If this environment blocks plumcut.com, use an available Vercel connector/API
to verify a successful production deployment of the commit and its generated
article artifact. Do not interpret a network block as a failed deployment.
If neither route is available, report `pushed, deployment unverified`, leave the
row approved, and let a later run verify it without republishing.

## 7. Close and report

Only after verification set Status = published, Published on to the original
publication date, and Live URL = https://plumcut.com/blog/<slug>.
If the Notion update fails, report it; the next run uses the retry path above.

Report title, URL, commit, verification result and remaining warnings. Never
publish more than one row, force push, hand-edit generated HTML, or claim a
verified deployment based solely on a Git push.
