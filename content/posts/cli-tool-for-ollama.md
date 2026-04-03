---
date: 2026-04-02T21:25:59-04:00
draft: false
tags:
- ai
- tools
title: Cli Tool for Ollama
---

## CLI tool for Ollama

Did a bit of research (Gemini), and suggestions are:
- `oterm`: best all around, for general chat
- `aichat`: power-user choice, good for coding
- `mods`: nice, but more pure CLI tool

## oterm
To install `oterm`, best to:
```sh
pipx install oterm
```

Evaluation:
- meh...
- the TUI is the one Claude Code generates for you, using Textual (I have same on my 'palantir' tool)
- whole bunch of things bother me:
  - pointless ASCII animation at start; was cool only the first time
  - hate the big fat buttons, pointless waste of TUI real-estate (esp. when there are keybinds for them)
  - it feels like a GUI application wearing TUI clothing

I could do better with my own Claude coding session in 1h... probably will.

## mods
Source: https://github.com/charmbracelet/mods

Assessment:
- pretty
- possible use, although I think I would prefer TUI

Huh! This is the first time I ran into this: the AI chat tool (or model?) got
into what seems like infinite loop of generating more and more content, veering
into further adjacent topic. I had to `Ctrl-C` after probably 10 minutes and 30
pages... Initial query was about which model would be best for coding, and I
ended up at topic "OPERATIONAL PROTOCOL AGREEMENT: SYSTEMIC EPISTEMIC REVIEW
(SER)"...!!
