---
title: How to Automate WhatsApp for Your Business in 2026
slug: how-to-automate-whatsapp-for-your-business
description: A practical walkthrough of WhatsApp automation for commerce brands, from the free Business app to the Cloud API, and how to pick the right level.
type: general
date: 2026-09-05
keywords: [how to automate WhatsApp, WhatsApp Business API, WhatsApp automation, WhatsApp chatbot, automate customer messages]
hero: https://images.unsplash.com/photo-1611746872915-64382b5c76da?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=srgb&w=1600
heroAlt: A phone showing a messaging app on a desk beside a laptop
heroCredit: Christian Wiediger
heroCreditUrl: https://unsplash.com/@christianw
related: [whatsapp-business-api-cost, best-whatsapp-automation-tools]
faq:
  - q: Can I automate WhatsApp for free?
    a: Partly. The free WhatsApp Business app gives you greetings, away messages and up to 50 quick replies, which covers a shop doing a handful of messages a day. It cannot answer questions, take an order or look anything up. For that you need the WhatsApp Cloud API, which is free to access but charges per conversation.
  - q: Will automating WhatsApp get my number banned?
    a: Not if you use official tools. Bans come from unofficial automation built on WhatsApp Web scraping, and from messaging people who never opted in. The Cloud API is Meta's sanctioned route, and staying inside it plus real opt-in keeps your number safe.
  - q: Does WhatsApp automation work in Arabic?
    a: Yes. The Cloud API is language agnostic, and modern language models handle Arabic, English and the mixed Arabizi that MENA shoppers actually type. What breaks is usually the product catalogue and the policy text behind the bot, not the language itself. plum is built for Arabic and English side by side.
  - q: How long does it take to set up?
    a: The free Business app takes an afternoon. A working Cloud API setup with a real catalogue, order lookups and a tested handover to a human is closer to two to four weeks, most of which is writing down what your team already knows. See how we run that in our build process.
---

Most brands do not have a WhatsApp problem. They have a first reply problem. The messages arrive, someone answers them eventually, and by then the customer has bought elsewhere. Automation is how you close that gap, and there are exactly three levels of it worth knowing.

> To automate WhatsApp for your business, pick one of three levels. The free WhatsApp Business app handles greetings, away messages and quick replies, and takes an afternoon to set up. A no code chatbot builder on top of the WhatsApp Cloud API handles menu driven flows like order status and FAQs, and takes a few days. A managed AI layer on the Cloud API answers open questions, sells from your catalogue and books appointments in natural language, and takes two to four weeks. The right level depends on message volume: under roughly 30 a day the free app is enough, and past a few hundred a day you need the API.

## The three levels, and who each one is for

### Level 1: the free WhatsApp Business app

This is the green app you download on a phone. It is free, it takes an afternoon, and it gives you three real things:

- **A greeting message** that fires the first time someone messages you
- **An away message** for outside working hours
- **Up to 50 quick replies**, saved answers you fire with a shortcut

That is the whole feature set. There is no logic, no branching, no lookups. A customer asking "do you have this in medium" gets a greeting, then silence until a human reads it.

**Use it if** you get fewer than about 30 messages a day and one person can genuinely keep up.

### Level 2: a chatbot builder on the Cloud API

The [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api) is Meta's official programmatic access to WhatsApp. Access is free. You pay Meta per conversation, and separately for whatever tool you build on top.

At this level you get button and menu driven flows. Customer taps "Track my order", the bot asks for an order number, calls your store, returns a status. Real automation, and a large jump from level 1.

The ceiling is that it only knows the paths you drew. Anything off the menu falls through to a human or a dead end, and shoppers do not type in menus. They type "hey is the beige one still available in 38".

**Use it if** your incoming messages are genuinely repetitive and mostly transactional.

### Level 3: a managed AI layer on the Cloud API

Same official plumbing, different brain. Instead of a decision tree, a language model reads the message, understands intent, and has real tools behind it: your catalogue, your stock, your order system, your booking calendar.

This is the level where automation stops being deflection and starts being **selling**. The customer asks a question, gets a real answer, gets shown the product, and checks out without a human touching it.

It is also the only level that produces something worth keeping: a record of what every customer asked, in their words. That is the part most brands underrate.

## What it actually costs

Meta bills per message delivered, not per conversation, a change that took effect on 1 July 2025. Prices vary by country and by template category: marketing costs the most, utility sits in the middle, and service messages inside the 24 hour window are free. As a rough shape:

| Level | Setup effort | Meta cost | Tooling cost |
| --- | --- | --- | --- |
| Business app | An afternoon | Free | Free |
| Chatbot builder | Days | Per message | Monthly SaaS fee |
| Managed AI layer | 2 to 4 weeks | Per message | Setup plus monthly |

Meta publishes current rates on its [platform pricing page](https://whatsappbusiness.com/products/platform-pricing/), and they change, so check before you budget. We broke the whole bill down in [what the WhatsApp Business API really costs](/blog/whatsapp-business-api-cost).

## The five things that break WhatsApp automation

After building these for commerce brands, the same five failures come up:

1. **No handover.** Every automation needs a clean exit to a human, and the customer needs to know it exists. Without it, one bad answer costs you the sale and the trust.
2. **A stale catalogue.** The bot confidently sells something you stopped stocking in March. Your automation is only as current as the feed behind it.
3. **Ignoring Arabic.** In MENA a large share of messages arrive in Arabic or Arabizi. An English only bot fails the customers most likely to buy from you.
4. **No opt in.** Messaging people who never asked is the fastest route to a blocked number, and it is a policy violation regardless of the tool.
5. **Nobody reads the transcripts.** The conversations are the most honest customer research you will ever own, and almost everyone throws them away.

## Choosing your level in one question

How many messages do you get a day?

- **Under 30:** the free Business app. Do not overbuild.
- **30 to a few hundred:** a builder on the Cloud API, if your questions are repetitive. A managed AI layer if they are not.
- **Past a few hundred:** a managed AI layer. At that volume the humans are the bottleneck and the lost sales are real money.

The honest answer for most growing brands is that they need level 3 about six months before they admit it. The tell is simple: if your team is copy pasting the same three answers all day, and messages still sit unanswered overnight, you are already past level 1.

## Where to start this week

Set up the free Business app today, even if you plan to outgrow it. Then spend a week logging every question you get and sorting it into three piles: questions with one right answer, questions that need a lookup, and questions that need a person. That list is the specification for whatever you build next, and it is the same thing we build from when we set up [what plum handles](/solutions) for a brand.
