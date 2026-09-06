# Task: blog publisher

**Run by:** the scheduled cloud routine `plumcut blog, publisher`, Mon / Wed / Fri / Sat at 10:00 UTC.
**Job:** publish exactly one approved post, then stop.
**Never:** write new content. That is the writer's job.

This file is the procedure. The routine prompt is only a pointer to it, so
changing this file changes what the run does on its next fire. Commit a change
here and it is live.

---

## Constants

| | |
| --- | --- |
| Notion Blog data source | `collection://0f269a5b-550b-4e9e-b34d-f4c4837be033` |
| Branch | `main`, pushed directly, Vercel deploys automatically |
| Posts per run | exactly 1, even if several are approved |

---

## Step 1. Find the work

Query for rows with `Status = approved`, **oldest `Created` first**.

> `Status` is a Notion **select** property, not a **status** property. Filtering
> it as `status` silently returns zero rows, and the run will wrongly report
> "nothing approved" while work is waiting.

No approved rows? Do nothing, report `nothing approved`, exit. Normal outcome.

Otherwise take the **oldest one only**. Read its properties and its full page body.

## Step 2. The already-published guard

Run `ls blog/posts/` and look for a file ending `-<slug>.md`.

If one exists, this row was already published by an earlier run that could not
update Notion. **Do not write it again.** A second file with the same slug makes
the build fail on a duplicate slug. Skip straight to Step 6, set the row to
published, and exit.

## Step 3. Convert the row to markdown

Read `blog/posts/_TEMPLATE.md` and `CLAUDE.md` first. Then `git pull`, and write
`blog/posts/YYYY-MM-DD-<slug>.md` using today's date.

**Front matter, from the row's properties:**

`title`, `slug`, `description`, `date` (today), `type`, `keywords` (split the
comma-separated string into a `[a, b, c]` list), `hero`, `heroAlt`, `heroCredit`,
`heroCreditUrl`, `heroSource`, `heroLicense`, `heroLicenseUrl`, `notionUrl`.

Omit any hero field that is empty rather than writing a blank value.

**Strip markdown link syntax out of plain-text fields.** Notion autolinks bare
names, so `[freestocks.org](http://freestocks.org)` must become `freestocks.org`.
`heroCredit` has to be the bare name or the rendered credit line breaks.

**Body conversion.** Notion rewrites the site's relative links into absolute
`app.notion.com/...` URLs on the way out. Restore them to real site paths:
`/solutions`, `/how-it-works`, `/pricing`, `/blog/<slug>`. Then:

- Drop everything before the post itself: the image block, the photo credit line,
  any `---` separator, and any Notion callout. Callouts are notes to humans, not
  part of the post.
- Everything up to `## FAQ` becomes the markdown body. The builder renders the
  hero from front matter, so the body must never repeat it.
- Each FAQ pair becomes a `- q:` / `a:` entry under `faq:`. Keep the wording
  identical to the visible text. The builder emits FAQPage schema from these and
  the schema must match what a reader sees, or the page violates Google's
  structured data guidelines.
- Convert Notion tables to markdown tables.

## Step 4. Build

```bash
node scripts/build-blog.js
```

Zero dependencies, no install needed. If it errors, fix the markdown and run it
again. **Never commit a failing build.**

Read the warnings it prints. Fix a thin post or an over-length description before
committing rather than shipping it and warning about it.

## Step 5. Commit and push

Commit the generated `blog/*.html`, `blog/rss.xml`, `sitemap.xml` and `llms.txt`
together with the new `.md` source. Name the post in the commit message. Push to
`main`.

**The sandbox may start on a detached HEAD.** If the push is rejected as
non-fast-forward: `git fetch origin main`, confirm your commit descends from
`origin/main`, then `git checkout -B main HEAD` and push. **Never force push.**

## Step 6. Verify the push, not the website

> The sandbox's egress proxy blocks `plumcut.com`. Curling the live URL always
> fails and proves nothing. Do not try; it will make you report a false failure
> on a post that actually shipped.

Success is: `git ls-remote origin refs/heads/main` equals your local HEAD.
Vercel deploys from `main` on its own.

## Step 7. Close the row

Once the push is confirmed on the remote, update the Notion row:

- `Status = published`
- `Published on` = today
- `Live URL` = `https://plumcut.com/blog/<slug>`

**If and only if the push never landed**, leave the row as `approved` so the next
run retries it, and report the failure clearly.

## Never

- Hand-write HTML. The builder owns the template. If the design needs to change,
  change `scripts/templates/page.html` or `BLOG_CSS` and every post re-renders.
- Publish more than one post per run.
- Force push.
