# plumcut repository instructions

Read CLAUDE.md for the site structure and copy rules. The same project rules
apply to every agent. Blog source is blog/posts/*.md; edit the generator or
Markdown, never generated blog HTML directly.

For drafting, read blog/tasks/writer.md and blog/tasks/editorial.md. For publishing,
read blog/tasks/publisher.md and blog/tasks/editorial.md. These are the shared
GitHub runbooks used by scheduled agents; fetch the current version before a run.
Preserve human approval in Notion. Do not invent reviews, results or credentials.

Validate changes with node scripts/build-blog.js --check. For builder changes,
also run node --test scripts/blog.test.js. Rebuild tracked generated outputs with
node scripts/build-blog.js. Every push to main deploys the site through Vercel.
