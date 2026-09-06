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

## Running locally rather than in the sandbox

The runbook is written for the cloud sandbox, where `plumcut.com` is blocked, so
Step 6 defines success as the push landing on `origin`.

**On a local machine that check is weaker than it needs to be.** After confirming
the push, also poll `https://plumcut.com/blog/<slug>` until it returns 200, for
up to two minutes. Only then update Notion. If it never comes up, say so and
leave the row `approved` so the next run retries.

## Before you push

Say what you are about to do and wait for the user to confirm, since this puts a
page on a live public site:

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
- Mark a row published when the push did not land.
