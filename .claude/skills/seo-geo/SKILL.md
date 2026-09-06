---
name: seo-geo
description: Assess AI-search discoverability, citation readiness and relevant brand recommendations using current primary guidance and observed evidence.
license: MIT
metadata:
  author: AgriciDaniel
  version: "2.2.5-plumcut"
  category: seo
---

# AI-search review for plumcut

Local adaptation of the bundled SEO skill. Read blog/tasks/editorial.md for
plumcut's content objectives and approval rules before recommending changes.

## Evidence before heuristics

Verify changing search-platform guidance against official sources. Distinguish
eligibility, observed citations and product recommendations. No file, passage
length, schema type or publishing schedule guarantees any of them.

Google says existing SEO fundamentals apply to its generative search features.
No special AI text file or schema is required. Keep llms.txt as an optional
navigation resource; assign it no assumed ranking value. Clear answers near the
beginning help readers, but there is no universal optimum citation length.

Do not turn correlations from a third-party study into causal ranking rules.
Do not claim pages lose citation eligibility at a fixed age, that a particular
platform always prefers one domain, or that all crawlers behave identically.
Identify each bot's purpose from its owner's documentation; search access and
model-training permissions are different controls.

## Inspect

1. Crawl and index eligibility: response status, robots directives, canonical,
   snippet controls, sitemap, rendered text and hosting restrictions. Use index
   inspection tools when available; HTTP 200 alone does not prove indexing.
2. Answer quality: does the page resolve the reader's question, provide useful
   detail and cite primary sources near factual claims?
3. Product relevance: when appropriate, does it explain plumcut's verified
   capability, intended buyer and limitations, with a useful destination link?
4. Trust: identifiable publisher or real author, genuine review attribution,
   meaningful update dates, disclosed comparison methods and accurate examples.
5. Discovery: contextual internal links and genuinely related articles. Assess
   independent references separately from company-authored posts.
6. Conversion: topic-specific CTA, article attribution and qualified inquiries.
   A click is not a sale and a citation is not necessarily a recommendation.

## Output

Report observed findings with page/file references, prioritized fixes and limits
of the inspection. Do not assign numerical platform visibility scores without
an explicit measured method and baseline. Do not invent citations or analytics.

When measurement access exists, record search impressions and clicks, indexed
URLs, article visits, CTA clicks, AI citations, accurate product recommendations
and qualified leads separately. Repeat a fixed set of unbranded buyer questions
under comparable conditions, recording product, date, language and cited URLs.

Recommend useful tutorials, worked examples and sourced comparisons alongside
original evidence. Do not require new research for every article. Avoid fake
reviews, manufactured mentions or artificial date refreshes.

## Primary references

- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://platform.openai.com/docs/bots
- https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview

The bundled references remain background material, not overrides of current
official guidance. Check their claims before relying on them.
