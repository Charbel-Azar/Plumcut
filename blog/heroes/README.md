# Hero library

Licensed hero images committed to the repo, with `manifest.json` describing each one.

## Why these live here instead of being fetched

The scheduled runs execute in a cloud sandbox with a network egress allowlist. Every image host is blocked: Unsplash, Pexels, Openverse, Flickr. The sandbox *can* clone this repo, so keeping the images here is what makes a fully cloud-based pipeline possible.

It is also better practice regardless. No hotlinking, no link rot, no host deciding to return 403 one day and silently breaking a live post. StockSnap already does exactly that.

## How the writer uses it

Read `manifest.json`, match `tags` against the post's subject, pick the best fit, and put its `file` value straight into the post's `hero` front matter:

```yaml
hero: /blog/heroes/market-stall.jpg
heroAlt: A busy market stall with goods on display
heroCredit: mikecogh
heroCreditUrl: https://www.flickr.com/photos/mikecogh
heroSource: Flickr
heroLicense: CC BY 2.0
heroLicenseUrl: https://creativecommons.org/licenses/by/2.0/
```

Copy `alt`, `credit`, `creditUrl`, `source`, `license` and `licenseUrl` from the manifest entry verbatim. Attribution is a licence condition, not a courtesy, and the builder renders it under the image.

Reusing an image across posts is fine and expected. Prefer one not used by a recent post.

## Reviewing and pruning

Open `contact-sheet.html` in a browser. It shows every image cropped exactly the way a hero renders, so what you see is what ships.

To remove one you dislike:

1. Delete the `.jpg`
2. Delete its entry from `manifest.json`
3. `node scripts/build-blog.js` and check nothing referenced it

To add one: run `node scripts/find-image.js "search terms"` from a machine with network access, save the image here at roughly 1600px wide as JPEG quality 82, and add a manifest entry with real tags and full attribution.

## The rules these were chosen against

`blog/ART-DIRECTION.md`. Two that matter most here: no Arabic script, because posts are English and that includes imagery, and nothing with a recognisable brand logo.

These were selected on metadata rather than by eye, so **prune anything that does not look right to you**. That judgement is the one part of this the pipeline cannot do for itself.
