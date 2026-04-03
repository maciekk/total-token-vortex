+++
date = '2026-04-02T18:57:29-04:00'
draft = true
title = 'New Hugo Post'
+++

How to properly start a new blog post in hugo (captured to shell script):

```bash
#!/bin/bash

FNAME=$1
FNAME_PATH=content/posts/$FNAME

cd ~/src/total-token-vortex/

hugo new $FNAME_PATH

# leave as 'draft' for now, to evaluate end result first
nvim $FNAME_PATH

# regen `public/`
hugo

# bring up local server, to review draft
hugo server -D
```
```
