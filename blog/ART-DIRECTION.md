# Blog hero art direction

The look every blog hero should hit. The image finder builds its search queries
from this, and the writer run rejects candidates that break it.

**Cosmos is the taste input, not the image source.** Curate a board of the look
you want at cosmos.so, then translate it into words here. Cosmos images cannot
be reused: they are other people's copyrighted work saved as references, their
terms grant third parties nothing, and their robots.txt disallows `/api/` for
every crawler including ClaudeBot. Never pull a file from a Cosmos board onto
the site. Match the look on a licensed source instead.

Cosmos board to match: <paste your board URL here>

## The look

- **Real and unstaged.** A phone on an actual counter, a shop at closing time, a
  hand mid-scroll. Documentary, not concept art.
- **Warm and slightly under-lit.** Late afternoon, tungsten, window light. Not
  bright flat studio white.
- **Muted, close to the brand.** Plum, terracotta, cream, warm grey, deep
  shadow. An image that sits next to `#481D52` and `#E65E04` without fighting.
- **Room to breathe.** One clear subject, negative space, shallow depth. The
  image is cropped to a wide banner, so anything busy turns to mush.
- **Human presence over human faces.** Hands, backs, a shoulder in frame. A
  face pulls focus off the headline and dates the post.
- **Commerce and MENA when it is honest.** A market stall, a boutique rail, a
  packing table, a courier bag. Never costume or cliché.

## Never

- Handshakes, glowing brains, robots, circuit boards, humanoid AI.
- Arrows going up, floating holograms, blue tech gradients, binary rain.
- Grinning stock models pointing at laptops.
- Screenshots of real WhatsApp threads containing anyone's actual messages.
- Anything with legible third-party branding or a recognisable logo.
- Signage or text in Arabic script. Posts are English, and that includes the
  imagery. A photo of an Arabic shop sign on an English post reads as a
  mismatch, even when the post is about Arabic support.
- AI-generated images. They read as AI, which is the one thing plumcut's own
  marketing cannot afford.

## Sources, in order

1. **Unsplash.** Best quality and the closest to this look. Free API key from
   unsplash.com/developers, set as `UNSPLASH_ACCESS_KEY`. Attribution to the
   photographer is required by their terms and the builder renders it.
2. **Pexels.** Good second net, different library. Free key from
   pexels.com/api, set as `PEXELS_API_KEY`.
3. **Openverse.** No key needed, so it always works, but quality is uneven and
   every result needs a human look. Only Creative Commons and public domain
   results that permit commercial use are requested.

Run `node scripts/find-image.js "your search terms"` to get ranked candidates
with front matter ready to paste.

## Cropping

Heroes render at `object-fit: cover` in a band roughly 1600 by 460, so the
subject has to survive a wide crop. Check the middle horizontal third of the
image. If the subject leaves that band, pick another photo.
