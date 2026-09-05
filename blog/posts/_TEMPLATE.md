---
# ---------------------------------------------------------------------------
# Blog post front matter. Files starting with _ are ignored by the builder.
# Copy this, fill it in, save as blog/posts/YYYY-MM-DD-<slug>.md
#
# The parser is a small YAML subset: `key: value`, `key: [a, b]`, and indented
# `- ` lists (including the `- q: / a:` maps used by faq). Do not use anchors,
# multi-line scalars, or nested maps beyond what is shown here.
# ---------------------------------------------------------------------------

# REQUIRED -------------------------------------------------------------------
title: How to Do The Thing in 2026          # the H1 and the <title>, 50 to 65 chars
description: One sentence that earns the click. Under 165 characters or the build warns.
date: 2026-09-05                            # YYYY-MM-DD, the publish date

# STRONGLY RECOMMENDED -------------------------------------------------------
slug: how-to-do-the-thing                   # defaults to a slug of the title. Never change it after publishing.
type: general                               # general | comparison | direct
keywords: [primary keyword, secondary keyword, a third one]

hero: https://images.unsplash.com/photo-XXXXXXXX?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=srgb&w=1600
heroAlt: A real description of what is in the photo, not the post title
heroCredit: Photographer Name               # required by Unsplash terms
heroCreditUrl: https://unsplash.com/@handle

# OPTIONAL -------------------------------------------------------------------
updated: 2026-10-01                         # set when you materially revise a live post
related: [slug-one, slug-two]               # otherwise the 3 newest posts are used
ctaLine: One sentence tying this post to what plum does. Falls back to a generic line.
notionUrl: https://app.notion.com/p/...     # the row this was published from

# The FAQ renders as a visible accordion AND as FAQPage schema, always matching.
# 4 to 6 questions, each answered in 40 to 80 words. Omit the key for no FAQ.
faq:
  - q: A question a real person would type into Google?
    a: A complete answer in 40 to 80 words. Self contained, no "see above". This is what an AI assistant lifts and cites.
  - q: A second question?
    a: A second answer.
---

Two to four sentences naming the reader's actual problem. No throat clearing.

> The citable answer block. 130 to 170 words, self contained, answering the
> title question completely for someone who reads nothing else. This is the
> paragraph AI Overviews and ChatGPT lift and cite, so it carries more weight
> than any other in the post. Put it immediately after the opening.

## A section heading

Body copy. Rules that matter:

- **No em dashes or en dashes.** Commas or full stops. The build replaces any
  that slip through and warns.
- **plumcut and plum are always lowercase.** Never "AI agent" or "AI system".
- **WhatsApp only.** Never Instagram in public site copy.
- 2 to 4 in-body internal links: `/solutions.html`, `/how-it-works.html`,
  `/pricing.html`, other `/blog/` posts.
- 1 to 3 external links to primary sources.
- Never invent a statistic, a case study or a customer.

### A subsection

| Supported | Also supported |
| --- | --- |
| Tables | Numbered and bulleted lists |
| Blockquotes | Fenced code blocks |

## A closing section

Tell the reader what to do this week. The builder appends the CTA block, the
FAQ accordion and the related posts grid, so do not write those here.
