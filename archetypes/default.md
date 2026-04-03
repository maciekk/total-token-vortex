---
date: {{ .Date }}
draft: true
tags:
- blog
title: {{ replace .File.ContentBaseName "-" " " | title }}
---
