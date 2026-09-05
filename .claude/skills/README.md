# Vendored SEO skills

These seven skills are copied from **[AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo)**, MIT licensed. Upstream commit `a1480c7`, 26 August 2026. The full licence is in `CLAUDE-SEO-LICENSE`.

## Why they are vendored rather than installed

The blog publisher runs as a scheduled cloud task. A cloud run gets a clean sandbox with no plugins installed, so `/plugin install claude-seo` is not available to it. Copying the skill files into the repo is the only way the scheduled run can read the methodology.

Only the seven relevant to writing and publishing articles are here. The upstream repo has 25, including local SEO, maps, backlinks, hreflang and image generation, which this site does not need.

| Skill | What the blog pipeline uses it for |
| --- | --- |
| `seo-geo` | The most important one. Passage citability for AI Overviews and chat assistants, which is what the self-contained answer block after each intro is for |
| `seo-content` | E-E-A-T checks against Google's own guidance |
| `seo-content-brief` | Target keywords, outline shape, internal link planning |
| `seo-schema` | Structured data that matches visible content, never schema for things a reader cannot see |
| `seo-page` | On-page fundamentals: title, description, headings, canonical |
| `seo-cluster` | Topical clustering, used when choosing what to write next so posts reinforce each other |
| `seo-images` | Alt text and image SEO |

## How to use them

**In the scheduled writer run:** read `seo-geo/SKILL.md` and `seo-content/SKILL.md` before writing, and `seo-content-brief/SKILL.md` when planning the outline. They are reference documents, not commands.

**Locally:** they live in `.claude/skills/`, so Claude Code discovers them in this project automatically.

**For a full audit** (`/seo audit`, `/seo geo` and the other 32 commands), install the real plugin on your own machine. It does far more than these seven files:

```
/plugin marketplace add AgriciDaniel/claude-seo
/plugin install claude-seo@agricidaniel-claude-seo
/seo setup
```

## Updating

Re-copy from upstream and note the new commit above. Do not edit these files in place: local edits will be silently lost on the next update, and plumcut-specific rules belong in `CLAUDE.md` or the Notion `cowork - Blog` page instead.
