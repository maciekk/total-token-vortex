---
aliases:
- /posts/new-hugo-post/
date: 2026-04-02T18:57:29-04:00
draft: false
tags:
- Hugo
- Blogging
title: New Hugo Post
---

## Preface

First, hugo can (and does) use two formats, YAML (---) and TOML (+++).

It is recommended:
- use TOML for config (e.g., `hugo.toml`)
- use YAML for content frontmatter

I've seen one place mention using `--format yaml`, but this fails when I try `hugo new content`, says flag is not known.

Alternatively, it might be better just to edit `archetypes/default.md`, which is used as template for new posts.

Also, on `config/_default/hugo.toml` can add option:
```toml
# For YAML
metaDataFormat = yaml
```

## Creating new post
How to properly start a new blog post in hugo (captured to shell script):

```bash
#!/bin/bash

FNAME=$1
FNAME_PATH=content/posts/$FNAME

cd ~/src/total-token-vortex/

hugo new content $FNAME_PATH

# leave as 'draft' for now, to evaluate end result first
nvim $FNAME_PATH

# regen `public/`
hugo

# bring up local server, to review draft
hugo server -D
```

## Post Scriptum

In case of mess up with TOML-vs-YAML, apparently you can have `hugo` convert:
```sh
hugo convert toYAML --output content_as_yaml
```
