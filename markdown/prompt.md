You're rebuilding the plumcut.com website. I've added two markdown files to the
repo — read them in full first and treat them as the spec:
- plumcut-website-redesign-brief.md  (the full redesign: what to change, add, cut, per page)
- plumcut-how-it-works-page.md        (ready-to-use copy for a new "How it works" page)

Also read the current site files (index.html, services.html, pricing.html,
about.html, and shared nav/footer/CSS/JS) so you understand the existing structure,
brand, and shared components before changing anything.

HOUSE RULES (non-negotiable):
- "plumcut" and "plum" are always lowercase, even at the start of a sentence.
- Never call the product an "AI agent" or "AI system." Lead with what plum does
  ("plum answers, sells, books") and use "the AI that sells" as the category line.
- No niche/vertical is named — keep copy niche-agnostic, written to one busy,
  high-traffic business owner.
- Lead with selling, not support/deflection.
- Keep the existing brand world: dark theme, the plum mascot, the loader, all
  current assets. Sharpen it, don't replace it.

WHAT TO DO (follow the brief section by section):
1. Home — rebuild to the section order and copy in §2 of the brief (selling-first
   hero, problem, how plum sells, the insight layer, trimmed solutions, 3-step
   how-it-works that links out, honest proof/live-demo, why-plumcut, FAQ→plum,
   final CTA).
2. New "How it works" page — build it from plumcut-how-it-works-page.md, matching
   the site's shared nav/footer/styles. Add it to the nav.
3. Services → rename to "Solutions"; remove the 40-logo integrations directory
   (replace with the small reassurance strip in §3.1); rebuild the nine blocks into
   the sales-first bundle in §3.2; add the "how we work / done-for-you" block.
4. Pricing — replace the model with §4: one monthly bundle + one-time setup +
   fair-use + insights add-on; sell the logic, not hard numbers; rewrite the FAQ.
   IMPORTANT: delete the current "no setup fees / no hidden costs" FAQ answer — it
   contradicts the real model.
5. About — keep the "30+ stores" origin, re-aim it (§5), add the three founders
   (Nour, Charbel, Michael), reframe the problems list selling-first.
6. Sitewide (§1): set ONE accent color as a CSS token and apply everywhere (I lean
   orange — flag me before committing); rename nav ("Services"→"Solutions", add
   "How it works"); rewrite the footer copy; rewrite the SEO title/description/
   keywords on every page to the new positioning; make "Talk to plum" (the wa.me
   WhatsApp link) the primary CTA and "Book a 15-min call" the secondary; update
   © to 2026.
7. Mobile-first: review every change at 380px width before desktop.

HONESTY GUARDRAILS — do NOT ship these without me:
- Remove the fabricated case-study numbers (3x leads, +60% furniture, salon 10→50,
  no-shows 22%→4%) and the templated testimonials. Replace with the live-demo
  proof block; leave a clearly-labeled placeholder for one real pilot.
- Don't invent any stats, prices, or results. Where a real number is needed but
  unknown, leave a clear TODO placeholder and tell me.

HOW TO WORK:
- Don't connect the layout to RTL/Arabic yet, but don't hard-code left alignment in
  a way that blocks adding it later.
- Go page by page. Show me a diff/summary after each page and pause for my OK before
  the next. Don't refactor shared nav/footer/CSS without flagging it first.
- If anything in the brief is ambiguous, ask me one question rather than guessing.

Start by reading all the files and the current site, then give me a short plan and
the list of assumptions you're making. Don't write code until I confirm.