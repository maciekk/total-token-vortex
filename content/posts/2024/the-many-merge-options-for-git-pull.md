---
date: 2024-08-20 17:03:00+00:00
draft: false
tags:
- Git
- Programming
title: The many merge options for 'git pull'
---

Ran into this (massive hint printout from git when attempting pull)

> ```
> Hint: You have divergent branches and need to specify how to reconcile them.
> Hint: You can do so by running one of the following commands sometime before
> Hint: your next pull:
> Hint: 
> Hint:   git config pull.rebase false  # merge
> Hint:   git config pull.rebase true   # rebase
> Hint:   git config pull.ff only       # fast-forward only
> Hint: 
> Hint: You can replace "git config" with "git config --global" to set a default
> Hint: preference for all repositories. You can also pass --rebase, --no-rebase,
> Hint: or --ff-only on the command line to override the configured default per
> Hint: invocation.
> Git failed with a fatal error.
> Git failed with a fatal error.
> Need to specify how to reconcile divergent branches.
> ```

And then thankfully came across this [VERY informative StackOverflow post](https://stackoverflow.com/questions/71768999/how-to-merge-when-you-get-error-hint-you-have-divergent-branches-and-need-to-s):

TL;DR: probably best to just do 'git fetch' + 'git merge' for more manual, full-flexibility approach, rather than doing 'git pull'.
