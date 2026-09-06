# Task: blog writer

**Run by:** the scheduled cloud routine `plumcut blog, writer`, Tuesdays and Fridays at 05:00 UTC.
**Job:** write drafts into Notion for a human to approve.
**Never:** publish, push, or touch git. That is the publisher's job.

This file is the procedure. The routine prompt is only a pointer to it, so
changing this file changes what the run does on its next fire. No API call, no
routine edit. Commit a change here and it is live.

---

## Constants

| | |
| --- | --- |
| Notion Blog data source | `collection://0f269a5b-550b-4e9e-b34d-f4c4837be033` |
| Operating manual (editorial standards) | https://app.notion.com/p/3d28d6e734f481759adad61d2925733d |
| Draft backlog cap | 7 |
| Posts per run | `min(3, 7 - drafted count)` |

---

## Step 1. The backlog gate

Count rows with `Status = drafted`.

> `Status` is a Notion **select** property, not a **status** property. Filtering
> it as `status` silently returns zero rows and makes the run think the queue is
> empty. Query it as a select, or use SQL mode.

If the count is **7 or more**: stop. Write nothing. Report that the backlog is
full. That is a success, not a failure. It means the human has not caught up,
and writing more would be waste.

Otherwise write exactly `min(3, 7 - count)` posts this run.

## Step 2. Read before writing

The repo is checked out for you. Read all of these first:

- The **Notion operating manual** linked above. It holds the editorial
  standards: the three archetypes, voice, and what a good post looks like.
- `CLAUDE.md` for the house copy rules.
- `blog/posts/_TEMPLATE.md` for the exact front matter shape.
- `blog/ART-DIRECTION.md` for what a hero may and may not show.
- `.claude/skills/seo-geo/SKILL.md`. This governs the citable answer block,
  which is the single highest-value paragraph in any post. Read it properly.
- `.claude/skills/seo-content/SKILL.md` for E-E-A-T.

## Step 3. Pick topics

Read **every existing row** first, whatever its status, so you never repeat a
question already drafted, approved, published or killed.

Then find real questions people ask about AI and automation in their business,
WhatsApp automation, AI customer service, and integrating AI with ecommerce.
Weight toward MENA and Gulf commerce brands.

**Network reality.** This sandbox enforces an egress allowlist.
`suggestqueries.google.com` and `reddit.com` are blocked, and so is direct
fetching of `developers.facebook.com`. Do not burn turns retrying them. Use the
**WebSearch tool**, including domain-filtered searches with `allowed_domains`
when you need a primary source.

Set `Source` to what genuinely worked. If it was WebSearch, that is `web search`.

Roughly **two in three** posts should be `type: general`.

## Step 4. Write

900 to 1600 words each.

1. **Opening**, 2 to 4 sentences naming the reader's real problem. No throat
   clearing.
2. **The citable answer block**, a markdown blockquote immediately after the
   opening. 130 to 170 words, fully self-contained, answering the title question
   for someone who reads nothing else. This is what AI search lifts and cites.
3. **Body** in `##` sections. At least one table. Concrete numbers, named tools,
   real limits.
4. **A closing section** telling the reader what to do this week.
5. **4 to 6 FAQ questions**, each answered in 40 to 80 words.

Verify every factual claim against a primary source. Meta and Google docs beat
blog posts, and third-party blogs contradict each other constantly. Include 2 to
4 in-body internal links to `/solutions`, `/how-it-works`, `/pricing`, or blog
posts that already exist.

## Step 5. The hero image

**Do not fetch images.** Every image host is blocked in this sandbox. That is
why `blog/heroes/` exists.

Read `blog/heroes/manifest.json`, match its `tags` against the post's subject,
and pick the best fit. Prefer one a recent post has not used. Copy the entry into
the Notion row verbatim:

| Notion property | Manifest field |
| --- | --- |
| Hero image | `file`, e.g. `/blog/heroes/market-stall.jpg` |
| Hero alt | `alt` |
| Hero credit | `credit` (may be empty for CC0, that is correct) |
| Hero credit URL | `creditUrl` |
| Hero source | `source` |
| Hero license | `license` |
| Hero license URL | `licenseUrl` |

Attribution is a licence condition, not a courtesy. Reusing an image across posts
is fine and expected. If nothing in the library genuinely fits, leave the hero
fields empty and say so in your report. **Never invent an image URL.**

## Step 6. Create the rows

One Notion row per post. `Status = drafted`. Every property filled.

Page body, in this order, because the publisher parses exactly this shape:

1. The image as `![alt](https://plumcut.com/blog/heroes/<file>.jpg)`, absolute
   so Notion renders it
2. A photo credit line
3. `---`
4. The post
5. `## FAQ`, then each question in bold with its answer beneath

Set the page cover to the same absolute URL so the row reads properly when a
human opens it.

## Never

- Em dashes or en dashes. Use commas, full stops, or restructure.
- Arabic script in the body, headings or hero. Posts are English. Latin-script
  Arabizi quoted as an example ("3andkon", "kifak") is fine and is usually the
  point of the sentence; writing *about* Arabic and MENA support is encouraged.
- Capitalised "Plumcut" or "Plum". Both are always lowercase.
- Calling plum an "AI agent" or "AI system".
- Instagram. Public copy is WhatsApp only.
- Invented statistics, case studies or customers.

## Finish

Stop after creating the rows. A human approves them, then the publisher ships
them. Report how many you wrote, which questions you chose, where each came from,
and which hero you assigned to each.
