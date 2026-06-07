# plumcut — website redesign brief

*Full content + structure + UI/UX direction. Built on the positioning: a done-for-you AI that **sells** in your Instagram/WhatsApp DMs, and turns those conversations into customer insight the business owns.*

*Two house rules baked into every line below:*
- *"plumcut" and "plum" stay lowercase everywhere, including the start of sentences.*
- *We don't call the product an "AI agent" or an "AI system." We lead with what **plum** does ("plum answers, sells, books"), and describe the category as "the AI that sells." Keep it human, not technical.*

---

## 0 · The north star (read this first — every page inherits it)

**The one-liner the whole site serves:**
> plumcut builds and runs the AI that sells in your DMs — plum answers your customers, sells to them, and books them on Instagram and WhatsApp, then turns those conversations into a clear picture of why they buy, which you own.

**The one person every line of copy is written for:** the owner of a busy, high-traffic business that sells through Instagram and WhatsApp DMs plus a store — a small team, often just the owner answering messages, including at night. The messages have outgrown what they can handle by hand. Ready-to-buy customers go cold because the reply came too late, and the owner has no real idea *why* the people who do buy choose what they choose. Write to that person. Not to a "business," not to a developer, not to a procurement team. (We're staying niche-agnostic on the surface — no single vertical named — but the *voice* should still feel like it's talking to one real, overwhelmed owner.)

**The three message shifts that drive the whole redesign:**

1. **From deflection to selling.** The current site sells relief ("never miss a message," "24/7 support without headcount," "handle FAQs"). The new site leads with revenue: plum upsells, cross-sells, and books. *Selling is the headline, support is a byproduct.*
2. **From tool to outcome.** The current site reads like a self-serve tool you wire up yourself (a 40-logo integrations grid, "plugs into your stack," "smart not robotic"). plum is done-for-you: we build it, run it, and improve it; you operate nothing. Drop the tool-vendor language and sell the result.
3. **Add the insight layer.** The sharpest differentiator — "we turn every conversation into a picture of why your customers buy, and you own it" — is currently almost absent. It needs to be a first-class story, not a generic "analytics" footnote.

**Voice & tone**
- Plain, warm, confident, a little witty (the brand already has wit — keep it, aim it).
- The owner's language, not jargon. Say "plum answers your customers and sells to them," not "natural language processing, sentiment detection, multilingual support."
- Short sentences. Concrete nouns. Every claim either provable or softened to a promise.
- Lead with the customer's world (DMs, lost sales, late-night replies), then the product.

**What plum is NOT (keeps copy honest and on-strategy)**
- Not a self-serve tool you configure yourself → drop tool-vendor language and the "configure your integrations" energy.
- Not a generic platform-native bot → emphasize cross-channel + tuned to your brand + *you own the data*.
- Not a dumb analytics dashboard → the insight comes from being *inside the conversation*, not from charting your existing metrics.
- Not cheaper-than-free → never compete on price against free platform tools. Compete on owned, brand-tuned, done-for-you, and insight.

**Honesty guardrail (important).** plumcut is pre-revenue with a first client just launching. The current case-study numbers (3× leads, +60% furniture, salon 10→50, no-shows 22%→4%) read as invented. They should come off the site or be relabeled. Proof on the new site comes from things that are *real*: the founder origin story, the live "talk to plum" demo, the clearly-explained mechanism, and — once it converts — one honest, possibly anonymized pilot. A believable site with thin proof beats a slick site with numbers a buyer can't trust.

---

## 1 · Site-wide / global changes

### 1.1 Brand & visual system
The existing brand world is good and worth keeping: dark theme, the lowercase wordmark, the "plum" mascot (the bean/plum characters in the hero), the playful-but-clean feel, the WhatsApp-native CTA. The redesign sharpens it, it doesn't replace it.

- **Resolve the accent-color conflict.** The site mixes an orange accent (the bullet markers, hero) with a purple `#864FFE` (services/pricing theme, tiles). Pick one primary and make the other a sparing secondary. Recommendation: **orange as primary** (warmer, more "plum," already on the hero and bullets), purple as a rare secondary. Set it once as a design token and apply everywhere — buttons, links, bullets, highlights.
- **Make "plum" a character, not a logo.** The mascot is an asset most competitors don't have. Use plum as the recurring guide through the page — near section intros, in the demo, in the FAQ. It humanizes a product that's literally about not feeling like a robot.
- **Type & hierarchy.** Bigger, fewer headlines. Several sections currently compete at the same visual weight. Establish a strict scale: one hero H1, section H2s, card H3s, body. Let whitespace carry the premium feel — "done-for-you / managed / owned" should *look* more considered than a self-serve tool.
- **Mobile-first, seriously.** The buyer lives in DMs on a phone. Design and review every section on a 380px screen first, desktop second. The hero, the demo, and the pricing must be flawless on mobile.

### 1.2 Navigation
- Keep it small and clear. Recommended: **Home · How it works · Solutions · Pricing · About**, plus a persistent primary CTA button.
  - "How it works" earns a slot because the done-for-you model is the thing buyers must *understand* to trust it. (Full page copy is in the separate "how-it-works page" doc.)
  - "Services" → rename to **"Solutions"** (you sell outcomes, not hours — and it sets up the bundle story).
  - Consider an **"Insights"** entry later if the customer-understanding layer gets its own page (see §6).
- The nav CTA should be the WhatsApp "talk to plum" action (it doubles as a live demo — see 1.3).

### 1.3 Primary call-to-action strategy (a UX advantage you're underusing)
You have a working, talkable plum on WhatsApp behind "Chat with plum!" — that's a **live, interactive demo**, not just a contact link. Most competitors can only *describe* their product; you can let the buyer talk to plum in one tap. Make that the spine of your CTA system:

- **Primary CTA everywhere:** *"Talk to plum"* (→ wa.me link). Frame it as "don't read about it — message it like one of your customers would." This is the single best conversion asset you own.
- **Secondary CTA:** *"Book a 15-min call"* for owners who want the human/managed conversation. Use this on Pricing and at the bottom of pages.
- Stop using identical generic "Get started" buttons; give each its job.

### 1.4 Footer (rewrite)
The current footer still says "intelligent chatbots and automation systems… Based in Lebanon, built for businesses ready to scale." Replace with the new positioning, e.g.:

> plumcut builds and runs the AI that sells in your DMs — answering, booking, and turning every conversation into insight you own. Built in Lebanon, made for the brands of the region.

Keep menu + socials. Update the year (© 2026). Add the WhatsApp CTA in the footer too.

### 1.5 SEO / metadata (all four pages need rewriting)
Every page's title, description, and keywords still describe the old generic agency ("AI Chatbots & Business Automation," "lead capture, appointment booking… SMB automation"). Rewrite around the new terms: AI that sells, Instagram/WhatsApp selling, conversational commerce, DM automation, customer insight, done-for-you, MENA/Arabic. Example home title/description:
- Title: `plumcut — the AI that sells in your DMs`
- Description: `plumcut builds and runs the AI that answers, sells, and books in your Instagram and WhatsApp DMs — then shows you why your customers buy. Done for you.`

### 1.6 The integrations problem (affects Solutions most, but it's a sitewide signal)
The 40-logo "configure your tools" grid makes plumcut look like a self-serve tool you wire up yourself — the opposite of "done-for-you." Integrations are a *reassurance*, not a *headline*. Demote them everywhere: a small "works with what you already use" strip (WhatsApp, Instagram, your store, your calendar, your payment links) instead of an exhaustive filterable directory. More in §3.

### 1.7 Localization (design for it now, even if v1 ships in English)
Arabic/MENA is core to the edge. Even if the first version is English, build the layout to support **RTL and Arabic type** later (don't hard-code left alignment; leave room for Arabic line lengths). A visible "العربية" toggle — even "coming soon" — signals the MENA-native promise the global competitors can't make.

---

## 2 · Home page (full rebuild, section by section)

The home page is the priority and the biggest change. Good bones exist; the message is wrong. Recommended section order top to bottom, with what to do to each.

### Recommended section order
1. Hero (selling-first)
2. Trust strip (channels + "talk to it" nudge)
3. The problem (the two pains)
4. How plum sells (the headline story)
5. The insight layer (flagship differentiator)
6. What plum does (solutions, trimmed)
7. How it works (done-for-you, 3 steps → links to full page)
8. Proof / live demo (honest)
9. Why plumcut vs the alternatives (new)
10. FAQ → talk to plum
11. Final CTA

---

### Section 1 — Hero — **REWRITE**
**Job:** in one screen, say it *sells*, and where (the DMs), without naming a niche.

Kill "AI Chatbots & Business Automation" + "you name it… we automate it." Replace with a selling-first hero. Draft directions (pick one, A/B the rest):

- **A (pain→outcome):** *"Your DMs are full of sales. plum closes them."*
  Sub: "plumcut builds and runs the AI that answers your customers, sells to them, and books them — on Instagram and WhatsApp, day and night. Then it shows you why they buy."
- **B (direct):** *"The AI that sells in your DMs while you sleep."*
  Sub: "Built and run for you. plum answers every message in your voice, turns questions into orders, and hands you the insight hiding in your own conversations."
- **C (specific moment):** *"Every 'is this still available?' is a sale. plum doesn't let it go cold."*
  Sub same as B.

**CTAs:** primary *"Talk to plum"* (live demo), secondary *"See how it works."*
**Design notes:** keep the plum/bean animation, but make the headline the loudest thing on the screen. One H1, one sub, two buttons, the mascot. Resist listing features above the fold. On mobile the headline + one button must fit without scrolling.

### Section 2 — Trust strip — **REWRITE (was the partner logos)**
**Job:** instant "this works where my customers already are."
- A slim row: *"Works in the channels your customers already use"* → Instagram, WhatsApp, your store. Add a tiny line: *"Already on WhatsApp? Message plum and see for yourself."*
- Drop the long logo wall here (n8n, Zapier, HubSpot, etc.) — those signal "tool," not "outcome." Keep at most the channels that matter to the owner.

### Section 3 — The problem — **ADD (new section)**
**Job:** make the owner feel seen before you pitch. This is where you earn the rest of the page.
Two pains, side by side:
- **The sales you can see slipping.** "A reply that comes six hours late is a sale you never see. Conversion drops sharply within minutes — and your customers message at midnight." *(You can reference the speed-to-lead reality without inventing your own numbers.)*
- **The customers you can't see.** "Every DM is full of signal — what they want, what they hesitate on, what they keep asking for that you don't even sell. It disappears, because no one can read thousands of conversations. So you guess at what to stock and why people buy."
**Design notes:** two columns on desktop, stacked on mobile. Quiet, empathetic, plenty of space. Let plum appear small here as the one who "reads every message so you don't have to."

### Section 4 — How plum sells — **ADD / promote (the headline product story)**
**Job:** prove the core claim — plum *generates* revenue, not just deflects.
Three to four concrete moments, in the customer's words:
- *Answers instantly, in your brand's voice* — "availability, shipping, returns, the same question for the hundredth time — answered in seconds, at 2am, the way you'd answer it."
- *Sells, doesn't just reply* — "recommends, suggests the matching add-on, nudges the hesitant buyer, recovers the cart."
- *Books and closes* — "from 'do you have this?' to a confirmed order or appointment, without you touching it."
**Design notes:** show a real-feeling chat thread (mock is fine, label it a sample) of plum turning a question into a sale. A phone frame with a believable DM exchange does more than any paragraph.

### Section 5 — The insight layer — **ADD (flagship differentiator, currently missing)**
**Job:** the thing no competitor sells. Frame it as the payoff of being inside every conversation.
- Headline idea: *"plum doesn't just sell. It tells you why."*
- Body: "Because plum is in every conversation, it sees what no dashboard can: why people buy, why they don't, the things they keep asking for, the demand you can't even see. You get a dashboard that turns thousands of chats into decisions — what to stock, what to drop, what to make next. And it's yours: your data, your customers, not locked inside a platform."
- One honest line: this is the layer you own vs. what the big platforms keep for themselves.
**Design notes:** a clean dashboard mock (even illustrative) showing 3–4 plain-language insights ("most-asked-for thing you don't sell," "top reason carts stall," "your busiest buying hour"). Readable, not a wall of charts — the point is *decisions*, not metrics.

### Section 6 — What plum does (solutions) — **REWRITE + TRIM**
**Job:** show the bundle without becoming a horizontal menu.
The current six tiles (Customer Service, Order Management, AI Conversations, Appointment Booking, Payment & Billing, Data & Analytics) are generic and support-led. Reframe **sales-first**:
1. **Sells & recommends** (upsell, cross-sell, cart rescue)
2. **Answers everything** (availability, shipping, returns, product questions, in your voice)
3. **Books & orders** (appointments, orders, confirmations, reminders)
4. **Order tracking** ("where's my package?" handled)
5. **Customer insights** (the owned dashboard — link to §5)
6. *(optional)* **See-it-first** — a visual preview for businesses that sell visual products, so the customer sees it before they buy.
**Design notes:** present these as one connected layer ("solutions that work together"), not a price-list of separate parts. Cut "Inventory management" from the front (back-office, off-message). One CTA: "See all solutions →" to the Solutions page.

### Section 7 — How it works — **REWRITE (the 3 steps) + link out**
**Job:** make "done-for-you" concrete and trustworthy. Summarize here, link to the full How it works page.
Reframe the three steps:
1. **We learn your brand** — your voice, products, policies, the questions you get.
2. **We build & launch** — plum goes live in your DMs in about two weeks; you don't touch a tool.
3. **We run, sell & improve** — we monitor and tune plum daily; you watch sales and insight grow.
**Design notes:** keep the 3-card visual; rewrite the labels (currently "Capture & Qualify / Engage & Support / Convert & Scale" — too generic and support-flavored). End with "See exactly how it works →".

### Section 8 — Proof / live demo — **REBUILD (honesty fix)**
**Job:** credible proof for a pre-revenue company.
- **Remove or relabel** the fabricated case studies. On a repositioned site they're both off-message and not believable.
- Replace with proof that's real:
  - **The live demo as the proof:** "Don't take our word for it. Message plum the way your customer would." Big, central, interactive.
  - **One pilot, honestly told** — once client #1 converts, a single (possibly anonymized) story with only numbers you can stand behind. Until then, omit numbers rather than invent them.
  - **The origin credibility** — a short "built by people who ran 30+ online stores" line (full story on About).
**Design notes:** make the demo the hero of this section. A short looping screen-capture of a real plum conversation beats testimonials.

### Section 9 — Why plumcut (vs the alternatives) — **ADD (optional but strong)**
**Job:** position against the real options without trashing anyone.
A simple, honest contrast: hiring more staff (expensive, sleeps, can't read its own DMs) · generic free platform bots (don't sell in your voice, keep your data) · plumcut (sells, cross-channel, tuned to your brand, you own the insight, done for you). Short and fair.
**Design notes:** a light 3-column comparison or a short checklist. Don't name competitors aggressively; frame around what the owner gets.

### Section 10 — FAQ → talk to plum — **KEEP (sharpen)**
The "skip the FAQ rabbit hole, just ask plum" idea is great and on-brand — keep it. Update the surrounding copy to the new positioning and make the CTA the live demo.

### Section 11 — Final CTA — **REWRITE**
Strong close: *"See what plum does to your DMs."* Primary "Talk to plum," secondary "Book a 15-min call."

---

## 3 · Solutions page (was "Services") — major restructure

**The page's job:** explain the bundle and the done-for-you model in depth, for an owner who's interested and wants detail.

### 3.1 The integrations grid — **CUT / DEMOTE (biggest change on this page)**
The 40+ filterable logo directory is the most off-strategy element on the site. It makes a *done-for-you* product look like a self-serve tool you assemble. Replace the directory with a small reassurance block: *"Already works with what you use — WhatsApp, Instagram, your store, your calendar, your payment links. We handle the wiring. You don't touch it."* If you want a longer list for SEO, move it far down or to a separate, de-emphasized page — never the opening of the Solutions page.

### 3.2 Restructure: from nine horizontal services → one bundle
The current nine blocks (Sales Automation, Customer Service, Data Analytics, Brand Companion, Appointment & Scheduling, Order & Inventory, Lead Qualification, Payment Processing, Multi-Channel) are a generic agency menu. Rebuild as the solution set, sales-first, each a clear card with a plain-language outcome:

- **The sales engine** *(lead with this)* — recommends, upsells, cross-sells, rescues carts, closes in the conversation.
- **Instant answers** — availability, shipping, returns, product questions, in your voice, 24/7.
- **Booking & orders** — appointments, orders, confirmations, reminders.
- **Order tracking** — "where's my order?" handled end to end.
- **Customer insights** — the owned dashboard: why they buy, what they ask for, what to stock. (Name it as a distinct, premium solution — it's also your best upsell.)
- *(optional)* **See-it-first** — visual preview for visual products.

For each card: one-line promise → 2–3 concrete things plum does → a "what your customer experiences" micro-example. No jargon.

### 3.3 Add: "How we work" (the done-for-you model)
A block explaining build → run → improve, and the "you operate nothing" promise. This is what separates you from every self-serve competitor; it deserves real estate here (and links to the full How it works page).

### 3.4 Design notes
- Consistent card system, sales-first ordering, lots of air.
- One accent color (per §1.1).
- Each card can carry a small plum illustration.
- End with the CTA pair: Talk to plum / Book a call.

---

## 4 · Pricing page — fix the model and the contradictions

**The page's job:** make a custom, done-for-you price feel fair and understandable without publishing final numbers you can't yet defend (pre-revenue).

### 4.1 Fix the model shown
The current two-tier table (Ready vs Custom) doesn't match your actual model and contains a real contradiction: the FAQ says *"no setup fees… no hidden costs,"* but your model has a setup fee plus fair-use overage. Fix this. Present the real structure plainly:

- **One simple monthly plan** — one number, everything bundled (plum answering, selling, booking, plus us running and improving it, and a normal volume of conversations included). It grows only when you add solutions.
- **A one-time setup** — to learn your brand and build & launch plum. Be upfront it exists; explain what it buys.
- **Fair use, not surprise bills** — a generous monthly allowance; if a campaign spikes volume way past it, there's a clear per-use rate, and you're always flagged first. Frame as protection, never a gotcha.
- **Customer insights** — available as part of the plan or as a standalone, named add-on.

### 4.2 Don't publish hard numbers yet — publish the *logic*
Since pricing is sized to the brand's real traffic and you're pre-revenue, show *how* pricing works and let the number come from a call: *"Your price is sized to your real volume. Tell plum about your brand and we'll put a number in front of you on a 15-minute call."* Honest, and it converts better than a fake price.

### 4.3 Rewrite the FAQ
Remove the "no setup fees" answer entirely. Rewrite around the new model and the buyer's real questions: *Do I have to operate anything? (No.) How fast do we launch? (~2 weeks.) What does it cost / why custom? Do I own my data? (Yes.) What if my volume spikes? Can I start with one solution and add more?* Lose the generic "AI chatbot for a small business" framing.

### 4.4 Design notes
- One clean plan card + an "insights add-on" + a "custom → talk to us." Simpler than the current matrix.
- Make "you own your data" a visible line on this page — a buying reason and a differentiator.
- Primary CTA: Book a 15-min call. Secondary: Talk to plum.

---

## 5 · About page — keep the soul, sharpen it

**The page's job:** trust. This is your strongest existing page — the "we ran 30+ stores, we lived this pain" story is real founder-market fit and survives the repositioning. Tighten and re-aim it.

### 5.1 Keep & sharpen the origin story
"Before we built automation, we built online stores. Over 30 of them" is a great opener — keep it, and land it on the new mission (selling + insight). Tie the lived pain explicitly to the two problems from the home page (lost late-night sales; flying blind on customers).

### 5.2 Add the team — **ADD (currently missing)**
Three named founders is a credibility asset, especially "MENA-native, Arabic-fluent" against English-first competitors. Add a short team section:
- **Nour — the intelligence.** Builds and runs what makes plum smart, and the infrastructure behind it.
- **Charbel — the product & the business.** Full-stack, the dashboard, and the people side.
- **Michael — design, brand & growth.** How plum looks, sounds, and reaches you.
Keep bios human and short. (Internally: you flagged no single owner of sales/revenue — worth resolving, but that's an org note, not website copy.)

### 5.3 Reframe "the problems we solve"
The current "you're dealing with… / we build you…" list has good structure but is generic and support-led. Re-aim it and put selling + insight first (cold leads → plum that *sells* back; guessing what to stock → insight you own).

### 5.4 Keep the promise, update it
"We won't sell you automation you don't need" is a strong, honest promise — keep it. Add the new mission line: build the AI that sells for the region's brands, and give them back the understanding of their own customers.

### 5.5 Design notes
- Warm, human, photography or illustrated team. Less grid, more story.
- The page to be most openly MENA/regional in voice.

---

## 6 · New pages / sections worth adding

- **The "How it works" page — now drafted** (separate doc: full page copy). Build it; link to it from the nav, the home 3-step section, and the Solutions "how we work" block.
- **An "Insights" page (recommended once the dashboard is real).** The owned-customer-understanding layer is your moat and your best upsell. A dedicated page — what it sees, what decisions it drives, why owning it matters vs. renting it from a platform — sells the premium tier. Until the dashboard exists, keep it as the home section (§5) and don't over-promise.
- **Eventually: an Arabic version.** The clearest proof of the MENA-native promise. Plan the build to allow it (§1.7).

---

## 7 · Priority roadmap — what to do first

1. **Home hero + message spine** (§0, §2.1–2.5). Lock the one-liner, the selling-first hero, the problem, the "how it sells," and the insight section. Everything inherits this.
2. **Honesty fixes** (§2.8, §4.1/4.3). Pull the fabricated case studies and the "no setup fees" line — fix these immediately regardless of the rest.
3. **Solutions restructure** (§3) — demote the integrations grid, rebuild as the sales-first bundle + done-for-you model.
4. **Pricing rebuild** (§4) — real model, logic-not-numbers, rewritten FAQ.
5. **How it works page** (separate doc) — publish alongside the home rebuild; it carries the "done-for-you" trust.
6. **About re-aim + team** (§5).
7. **Sitewide polish** (§1) — accent color, nav rename, footer, SEO, CTA system, mobile pass.
8. **Later:** Insights page, Arabic.

---

## 8 · Open items to settle before publishing (the honest TODO list)

- **Numbers.** No revenue/results numbers go live until client #1 gives you real ones. Replace every current stat with either a defensible figure or none.
- **First client.** Decide whether you can name or anonymize the launching brand for one honest pilot story.
- **The live demo.** Make sure "talk to plum" on WhatsApp works flawlessly end to end before you make it the site's centerpiece — it's about to carry your proof.
- **Pricing specifics.** Setup amount, monthly bundle, allowances, overage rates — sized from the trial. Keep them off the public page until then; sell the logic and the call.
- **Data ownership wording.** "You own your data" is a public promise now — make sure the contracts back it before it's on the pricing page.
- **Arabic timeline.** Decide if "العربية — coming soon" goes up now as a signal.
- **Accent color decision.** Orange vs purple — pick one and apply as a token everywhere.
