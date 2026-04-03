---
date: 2026-04-02T22:31:28-04:00
draft: false
tags:
- ai
- claude
- tools
- coding
- wip
title: Claude Local Replacement
---

> [!NOTE] This post is highly work-in-progress; gathering thoughts and ideas for now.

## Goal

1. build a near-equivalent of Claude using locally served models using Ollama
2. evaluate how close or far they are from, say, Sonnet 4.6

## Mise-en-scène

Pieces:
- Ollama [post](https://ollama.com/blog/claude): you can now use Ollama as backend for Claude Code tool! Just need:
```
export ANTHROPIC_AUTH_TOKEN=ollama
export ANTHROPIC_BASE_URL=http://localhost:11434
```
- recommendations from a `gemma4:4eb` chat:
  - use GGUF (or GGML) format
  - prefer `Q4_K_M` quantization
  - see if any community members have variants that they fine-tuned further on code
  - increase context window (e.g., 32k+ tokens)
  - **recommendation** (pre-Gemma4): highly quantized (Q4 or Q5) version of Mixtral or DeepSeek Coder in GGUF format
