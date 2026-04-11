---
aliases:
- /posts/claude-usage-megathread/
date: 2026-04-03T20:22:28-04:00
draft: false
tags:
- AI
- Claude
title: Claude Usage Megathread
---

Came across this today:
- [Claude Usage Limits Discussion Megathread Ongoing](https://www.reddit.com/r/ClaudeAI/comments/1s7fcjf/claude_usage_limits_discussion_megathread_ongoing/)

## Interesting Tidbids

From "B. CLAUDE CODE CLI WORKAROUNDS": add this to `~/.claude/settings.json`

```json
{
  "model": "sonnet",
  "env": {
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku"
  }
}
```

Also from B:

- Create a `.claudeignore` file
- Keep `CLAUDE.md` under 60 lines
- Install the read-once hook (below)
- `/clear` and `/compact` aggressively
- Install monitoring tools (below)
- Save explanations locally: `claude "explain the database schema" > docs/schema-explanation.md`

[Read-once](https://github.com/Bande-a-Bonnot/Boucle-framework/tree/main/tools/read-once) hook:
```sh
curl -fsSL https://raw.githubusercontent.com/Bande-a-Bonnot/Boucle-framework/main/tools/read-once/install.sh | bash
```

Monitoring tools:
- `npx ccusage@latest` — token usage from local logs, daily/session/5hr window reports
- `ccburn --compact` — visual burn-up charts, shows if you'll hit 100% before reset. Can feed ccburn --json to Claude so it self-regulates
- `Claude-Code-Usage-Monitor` — real-time terminal dashboard with burn rate and predictive warnings
- `ccstatusline` / `claude-powerline` — token usage in your status bar

