---
date: '2026-04-01T00:00:40-04:00'
draft: false
tags:
- blogging
- hugo
- programming
title: Migrating to Hugo (from Blogger)
---

Ooof, that was rough. Blogger underwent many migrations since I used it last, and whatever migration tooling people have come up with in the intervening years, all are now broken, unsurprisingly. After much Gemini poking, back-and-forth, we arrived at this, which "works" (reads atom.feed):

```python
# blogger_to_hugo.py
import feedparser
from markdownify import markdownify as md
import os
import re
from datetime import datetime

# CONFIG
ATOM_FILE = "feed.atom" # Point this to your file
OUTPUT_DIR = "content/posts"

os.makedirs(OUTPUT_DIR, exist_ok=True)
feed = feedparser.parse(ATOM_FILE)

def slugify(text):
    return re.sub(r'[\W_]+', '-', text.lower()).strip('-')

for entry in feed.entries:
    # Filter for actual blog posts (Blogger feeds include CSS and settings entries)
    if not hasattr(entry, 'content') or 'post' not in entry.id:
        continue

    title = entry.title
    slug = slugify(title) or f"post-{entry.id.split('-')[-1]}"
    date = entry.published # Standard ISO format usually
    content_html = entry.content[0].value

    # Convert HTML to Markdown
    markdown_body = md(content_html, heading_style="ATX")

    with open(f"{OUTPUT_DIR}/{slug}.md", "w") as f:
        f.write("---\n")
        f.write(f"title: \"{title}\"\n")
        f.write(f"date: {date}\n")
        f.write("draft: false\n")
        f.write("---\n\n")
        f.write(markdown_body)

print(f"Success: Processed {len(feed.entries)} entries into {OUTPUT_DIR}/")
```

Invocation:
```
uv run \
  --python 3.10 \
  --with feedparser \
  --with markdownify \
  python blogger_to_hugo.py
```

(you might still need to `pip install` some dependencies...)
