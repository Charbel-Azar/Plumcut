---
name: blog-draft
description: >
  Write plumcut blog drafts into the Notion Blog database for human approval.
  Researches a real question, writes the post, assigns a hero from the repo
  library, and creates the row as Status = drafted. Never publishes and never
  pushes. Use when the user says "write a blog", "draft a post", "blog draft",
  "generate blog ideas", "new field note", or asks for blog content for
  plumcut.
user-invocable: true
argument-hint: "[count 1-3] [optional topic or question]"
---

# Write plumcut blog drafts

This is the manual version of the scheduled writer run. Same output, same rules,
invoked by a human instead of a cron.

## The procedure lives in the repo, not here

**Read `blog/tasks/writer.md` and follow it.** That file is the single source of
truth for how a draft gets written, and the scheduled run reads the same file.
Do not work from this page alone; it only describes how manual invocation
differs.

If you are not in the plumcut repo, fetch it:
`https://raw.githubusercontent.com/Charbel-Azar/plumcut-Website/main/blog/tasks/writer.md`

## How arguments change the run

**`$1`, a count of 1 to 3.** Write that many posts. Default to **1** when the
user gives no number, because a human invoking this by hand usually wants one
they can read now, not three. The scheduled run defaults to 3; you do not.

**`$2` onward, an optional topic or question.** If the user names a subject,
skip Step 3's research entirely and write about what they asked. Still check
existing rows so you do not duplicate a question the pipeline already covered,
and still set `Question` to the actual question the post answers and `Source` to
`manual`.

With no topic given, do Step 3 exactly as written: research real questions,
weight toward MENA and Gulf commerce brands, and set `Source` honestly.

## The backlog gate still applies

Count `drafted` rows first. At 7 or more, **stop and tell the user the queue is
full**, naming what is waiting for approval. Do not quietly write anyway.

The one exception: if the user explicitly says to override the cap, say clearly
that you are exceeding it and why, then proceed.

## Before you finish

Show the user, in the chat, for each post you wrote:

- The title and the slug
- The **citable answer block** in full. It is the highest-value paragraph in the
  post and the thing most worth a human's eye before approval.
- Which hero you picked from `blog/heroes/manifest.json` and why that tag matched
- The Notion row URL

Then say plainly: these are `drafted`. Nothing reaches the site until a human
flips a row to `approved`, and the publisher run ships it.

## Do not

- Publish, push, commit, or touch git. That is `blog-publish`.
- Write the `.md` file into `blog/posts/`. The publisher does that from the
  approved Notion row, and a stray file there creates a duplicate slug that
  breaks the build.
- Invent an image URL. Heroes come from the library or the fields stay empty.
