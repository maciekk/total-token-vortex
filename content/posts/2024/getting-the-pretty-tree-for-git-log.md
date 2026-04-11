---
date: 2024-08-20 17:09:00+00:00
draft: false
tags:
- Programming
title: Getting the pretty 'tree' for 'git log'
---

See: <https://stackoverflow.com/questions/1057564/pretty-git-branch-graphs>

In short, can use this one-liner:

> git log --all --decorate --oneline --graph

You can also make this into its own 'git' command ('git adog') using:

>  git config --global alias.adog "log --all --decorate --oneline --graph"
