---
name: blog-publish
description: >
  Publish the oldest approved post from the Notion Blog database to
  plumcut.com. Converts the row to markdown, runs the blog build, commits and
  pushes to main, then marks the row published. Use when the user says
  "publish the blog", "ship the post", "publish approved", "push the blog", or
  asks to put an approved field note live.
user-invocable: true
argument-hint: "[optional slug to publish instead of the oldest]"
---

# Publish an approved plumcut post

This is the manual version of the scheduled publisher run. Same output, same
safeguards, invoked by a human instead of a cron.

## The procedure lives in the repo, not here

**Read `blog/tasks/publisher.md` and follow it exactly.** That file is the single
source of truth, and the scheduled run reads the same file. It contains the
conversion rules and four hard-won warnings that will bite you if you skip them.
Do not work from this page alone.

## How arguments change the run

**No argument:** publish the **oldest** approved row, exactly as the runbook says.

**A slug given:** publish that row instead, but only if its `Status` is
`approved`. If it is `drafted`, stop and tell the user it has not been approved
yet; do not approve it on their behalf. Approval is the human's gate and the
whole point of the pipeline.

## Verify publication

Follow Step 6 in the publisher runbook in every environment. Run
`node scripts/verify-blog.js <slug>` after building and pushing. A stale HTTP 200
or a landed commit is insufficient. If network restrictions prevent verification,
use the documented deployment API fallback or leave the row approved and report
`pushed, deployment unverified`.

## Before you push

Report the following before pushing. An explicit request to publish an approved
row authorizes that publication; do not ask again. If publication has not been
requested or authorized by the scheduled workflow, ask before pushing:

- The title, the slug, and the URL it will land on
- Any build warnings, quoted
- Confirmation that the visible FAQ count equals the schema `Question` count
- Confirmation of zero em dashes and zero Arabic script

## After

Report the live URL, the commit hash, and confirm the Notion row now reads
`published` with its Live URL set. If anything failed, say which step and leave
the row `approved`.

## Do not

- Publish more than one post per run.
- Force push, ever.
- Hand-write HTML. The builder owns the template; if the design is wrong, fix
  `scripts/templates/page.html` or `BLOG_CSS` and rebuild every post.
- Commit a failing build.
- Mark a row published before the deployment is verified.
